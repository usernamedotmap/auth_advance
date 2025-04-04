import { ErrorCode } from "../../common/enums/errorCode";
import jwt, { SignOptions } from "jsonwebtoken";
import { VerificationEnum } from "../../common/enums/verificationEnum";
import { LoginDto, RegisterDto, ResetPasswordDto } from "../../common/interface/auth.interface";
import { BadRequestException, HttpException, IntervalServerError, NotFoundException, UnauthorizeException } from "../../common/utils/catch-error";
import { anHourFromNow, calculateExpiresDate, ONE_DAY_IN_MS, thirtyMinutes, threeMinutesAgo } from "../../common/utils/date";
import SessionModel from "../../database/models/session.models";
import UserModel from "../../database/models/user.models";
import VerificationCodeModel from "../../database/models/verification.models";
import { config } from "../../config/app.config";
import { refreshTokenPayload, refreshTokenSignOptions, SignJwtToken, verifyJwtToken } from "../../common/utils/jwt";
import { sendEmail } from "../../mailers/templates/mailer";
import { passwordResetTemplate, verifyEmailTemplate } from "../../mailers/templates/template";
import { HTTPSTATUS } from "../../config/http";
import { hashedValue } from "../../common/utils/bcrpts";

export class AuthService {

    public async register(registerData: RegisterDto) {
        const { name, email, password } = registerData;

        const existingUser = await UserModel.exists({
            email,
        })

        if (existingUser) {
            throw new BadRequestException("User already exists", ErrorCode.AUTH_EMAIL_ALREADY_EXISTS);
        }

        const newUser = await UserModel.create({
            name, email, password,
        });

        const userId = newUser._id

        const verificationCode = await VerificationCodeModel.create({
            userId,
            type: VerificationEnum.EMAIL_VERIFICATION,
            expiredAt: thirtyMinutes(),
        });

        const verificationUrl = `${config.APP_ORIGIN}/confirm-account?code=${verificationCode.code}`

        await sendEmail({
            ...verifyEmailTemplate(verificationUrl),
        });
 
        return {
            user: newUser,

        };
    };

    public async login(loginData: LoginDto) {
        const { email, password, userAgent } = loginData;

        const user = await UserModel.findOne({
            email: email,
        });

        if (!user) {
            throw new NotFoundException("Invalid email or password", ErrorCode.AUTH_USER_NOT_FOUND);
        };

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            throw new BadRequestException("Invalid email or password", ErrorCode.AUTH_USER_NOT_FOUND);
        };

        if (user.userPreference.enable2FA) {
            return {
                user: null,
                mfaRequired: true,
                accessToken: "",
                refreshToken: "",
            }
        }

        const session = await SessionModel.create({
            userId: user._id,
            userAgent,
        });

        const accessToken = SignJwtToken({
            userId: user._id,
            sessionId: session._id,
        });

        const refreshToken = SignJwtToken({
            sessionId: session._id,
        },
            refreshTokenSignOptions
        );

        return {
            user,
            accessToken,
            refreshToken
        }

    };

    public async logout(sessionId: string) {
        return await SessionModel.findByIdAndDelete(sessionId)
    }

    public async refreshToken(refreshToken: string) {
        const { payload } = verifyJwtToken<refreshTokenPayload>(refreshToken, {
            secret: refreshTokenSignOptions.secret,
        });



        if (!payload) {
            throw new UnauthorizeException("Invalid refresh token");
        }

        const session = await SessionModel.findById(payload.sessionId);
        const now = Date.now();

        if (!session) {
            throw new UnauthorizeException("Session is nowhere to find");
        }

        if (session.expiredAt.getTime() < now) {
            throw new UnauthorizeException("Session expired");
        }

        const sessionRequiredRefresh = session.expiredAt.getTime() - now < ONE_DAY_IN_MS;

        if (sessionRequiredRefresh) {
            session.expiredAt = calculateExpiresDate(
                config.JWT.REFRESH_EXPIRES_IN
            );

            await session.save();
        }

        const newRefreshToken = sessionRequiredRefresh ? SignJwtToken({
            sessionId: session._id,
        }, refreshTokenSignOptions) : undefined;

        const accessToken = SignJwtToken({
            userId: session.userId,
            sessionId: session._id,
        }, refreshTokenSignOptions);


        return {
            newRefreshToken,
            accessToken
        }

    }

    public async verifyEmail(code: string) {
        const validCode = await VerificationCodeModel.findOne({
            code: code,
            type: VerificationEnum.EMAIL_VERIFICATION,
            expiredAt: { $gt: new Date() },
        });

        if (!validCode) {
            throw new BadRequestException("Invalid or expired verificatio code");
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            validCode.userId,
            {
                isEmailVerified: true,
            },
            {
                new: true,
            },
        );

        if (!updatedUser) {
            throw new BadRequestException("can't update your emali", ErrorCode.VALIDATION_ERROR);
        }

        await validCode.deleteOne()

        return {
            user: updatedUser,
        };
    };

    public async forgotPassword(email: string) {

        const user = await UserModel.findOne({
            email: email,
        });

        if (!user) {
            throw new NotFoundException("User not exist");
        }

        const timeAgo = threeMinutesAgo();
        const maxAttempts = 2;

        const count = await VerificationCodeModel.countDocuments({
            userId: user._id,
            type: VerificationEnum.PASSWORD_RESET,
            createdAt: { $gt: timeAgo }
        });

        if (count >= maxAttempts) {
            throw new HttpException(
                "Too many request, try again later",
                HTTPSTATUS.TOO_MANY_REQUESTS,
                ErrorCode.AUTH_TOO_MANY_ATTEMPTS,
            );
        };

        const expiresAt = anHourFromNow();
        const validCode = await VerificationCodeModel.create({
            userId: user._id,
            type: VerificationEnum.PASSWORD_RESET,
            expiredAt: expiresAt,
        });


        const resetLink = `${config.APP_ORIGIN}/reset-password?code=${validCode.code}&exp=${expiresAt.getTime()}`;

        const { data, error } = await sendEmail({
            ...passwordResetTemplate(resetLink),
        });

        if (error && error instanceof Error) {
            throw new IntervalServerError(` ${error.message}`);
        };

        return {
            url: resetLink,
            emailId: data?.id
        };
    };

    public async resetPassword({password, verificationCode}: ResetPasswordDto) {
        const validCode = await VerificationCodeModel.findOne({
            code: verificationCode,
            type: VerificationEnum.PASSWORD_RESET,
            expiredAt: {$gt: Date.now()},
        });

        if (!validCode) {
            throw new NotFoundException("Invalid or expired verification code");
        }

        const hashedPassword = await hashedValue(password);

        const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId,{
            password: hashedPassword
        }, { new: true });

        if (!updatedUser) {
            throw new BadRequestException("Failed to reset password");
        }

        await validCode.deleteOne();

        await SessionModel.deleteMany({
            userId: updatedUser._id,
        })

        return {
            user: updatedUser,
        }

    };




};