import { Request, Response } from "express";
import { catchError } from "../../middleware/catchError";
import { AuthService } from "./auth.services";
import { HTTPSTATUS } from "../../config/http";
import { emailSchema, loginSchema, RegisterSchema, resetPasswordSchema, verificationEmailSchema } from "../../common/validators/auth.validator";
import { clearAuthenticationCookies, getAccessTokenCookieOption, getRefreshTokenCookieOption, setAuthenticationCookies } from "../../common/utils/cookies";
import { NotFoundException, UnauthorizeException } from "../../common/utils/catch-error";

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public register = catchError(async (req: Request, res: Response) => {
        const body = RegisterSchema.parse({
            ...req.body,
        });

        const { user } = await this.authService.register(body);
        return res.status(HTTPSTATUS.CREATED).json({
            message: "User created successfully",
            data: user,
        });
    });

    public login = catchError(async (req: Request, res: Response) => {
        const userAgent = req.headers["user-agent"];
        const body = loginSchema.parse({
            ...req.body,
            userAgent,
        });

        const { user, accessToken, refreshToken, mfaRequired } = await this.authService.login(body);

        if (mfaRequired) {
            console.log("user: ", user)
           return res.status(HTTPSTATUS.OK).json({
            messsage: "Verify MFA aunthentication",
            mfaRequired,
            user,
           })
        }
        
        
        return setAuthenticationCookies({ res, accessToken, refreshToken }).status(HTTPSTATUS.OK).json({
            message: "User logged in successfully",
            mfaRequired,
            user,
        });
    });

    public logout = catchError(async (req, res) => {
        const sessionId = req.sessionId;

        if (!sessionId) {
            throw new NotFoundException("Session is invalid");
        }

        await this.authService.logout(sessionId);

        return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).json({
            message: "Logout successfully",
        })
    });


    public verifyEmail = catchError(async (req, res) => {
        const { code } = verificationEmailSchema.parse(req.body);
        await this.authService.verifyEmail(code);

        return res.status(HTTPSTATUS.OK).json({
            message: "Email Verified successfully"
        });
    });

    public forgotPassword = catchError(async (req, res) => {
        const email = emailSchema.parse(req.body.email);
        await this.authService.forgotPassword(email);

        return res.status(HTTPSTATUS.OK).json({
            message: "Reset Password link sent in your email",
        });
    });

    public resetPassword = catchError(async (req, res) => {
        const body = resetPasswordSchema.parse(req.body);

        await this.authService.resetPassword(body);

        return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).json({
            message: "Reset password successfully"
        })
    })



    public refresh = catchError(async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken as string | undefined;

        if (!refreshToken) {
            throw new UnauthorizeException("missing token");
        }

        const { accessToken, newRefreshToken } = await this.authService.refreshToken(refreshToken);


        if (newRefreshToken) {
            res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOption())
        }

        return res.status(HTTPSTATUS.OK).cookie("accessToken", accessToken, getAccessTokenCookieOption()).json({
            message: "toekn refresh successfully"
        });
    });

}

