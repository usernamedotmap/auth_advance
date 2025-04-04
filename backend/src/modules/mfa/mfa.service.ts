import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { BadRequestException, NotFoundException, UnauthorizeException } from "../../common/utils/catch-error";
import UserModel from "../../database/models/user.models";
import { Request } from 'express';
import SessionModel from '../../database/models/session.models';
import { session } from 'passport';
import { refreshTokenSignOptions, SignJwtToken } from '../../common/utils/jwt';

export class MfaService {

    public async generateMFAsetup(userId: string) {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new UnauthorizeException("User not authorized");
        };

        if (user.userPreference.enable2FA) {
            return {
                message: "MFA already enabled",
            };
        };

        let secretKey = user.userPreference.twoFactorSecret;

        if (!secretKey) {
            const secret = speakeasy.generateSecret({ name: "Sakin" });
            secretKey = secret.base32;
            user.userPreference.twoFactorSecret = secretKey;
            await user.save();
        }

        const url = speakeasy.otpauthURL({
            secret: secretKey,
            label: `${user.name}`,
            issuer: "squeezy",
            encoding: "base32",
        });

        const qrImageUrl = await qrcode.toDataURL(url);

        return {
            message: "Scan the qr code or use the setup key",
            secret: secretKey,
            qrCode: qrImageUrl
        }
    };

    public async verifyMFAsetup(userId: string, code: string, secretKey: string) {
        const user = await UserModel.findById(userId)

        if (!user) {
            throw new UnauthorizeException("User not authorized");
        }

        if (user.userPreference.enable2FA) {
            return {
                message: "MFA is already enabled",
                userPreferences: {
                    enable2FA: user.userPreference.enable2FA,
                },
            };
        };

        const isValid = speakeasy.totp.verify({
            secret: secretKey,
            encoding: "base32",
            token: code,
        });

        if (!isValid) {
            throw new BadRequestException("Invalid MFA code. Please try again");
        }

        user.userPreference.enable2FA = true;

        await user.save();

        return {
            message: "MFA setup completed successfully",
            userPreferences: {
                enableF2A: user.userPreference.enable2FA
            }
        };
    };

    public async revokeMFA(userId: string) {
        const user = await UserModel.findByIdAndUpdate(userId, {}, { new: true })

        if (!user) {
            throw new UnauthorizeException("User not authorized");
        }

        if (!user.userPreference.enable2FA) {
            return {
                message: "MFA is not enabled",
                userPreferences: {
                    enable2FA: user.userPreference.enable2FA,
                },
            };
        };


        user.userPreference.twoFactorSecret = undefined;
        user.userPreference.enable2FA = false;

        await user.save();

        return {
            message: "MFA revoke successfully",
            userPreferences: {
                enable2FA: user.userPreference.enable2FA,
            },
        };
    };

    public async verifyLoginMfa(code: string, email: string, userAgent: string) {


        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (!user.userPreference.enable2FA && !user.userPreference.twoFactorSecret) {
            throw new BadRequestException("MFA is not enabled for this user");
        }

        const isValid = speakeasy.totp.verify({
            secret: user.userPreference.twoFactorSecret || "",
            encoding: "base32",
            token: code
        });

        if (!isValid) {
            throw new BadRequestException("Invalid MFA code. Please try again");
        }

        const session = await SessionModel.create({
            userId: user._id,
            userAgent,
        });

        const accessToken = SignJwtToken({
            userId: user._id,
            sessionId: session._id
        });

        const refreshToken = SignJwtToken({
            sessionId: session._id
        },
            refreshTokenSignOptions
        )

        return {
            user,
            accessToken,
            refreshToken,
        }
    };

    
}