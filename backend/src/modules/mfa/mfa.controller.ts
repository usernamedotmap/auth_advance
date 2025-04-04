import { BadRequestException, NotFoundException, UnauthorizeException } from "../../common/utils/catch-error";
import { setAuthenticationCookies } from "../../common/utils/cookies";
import { verifyLoginMfaSchema, verifyMfaSchema } from "../../common/validators/mfa.validator";
import { HTTPSTATUS } from "../../config/http";
import { catchError } from "../../middleware/catchError";
import { MfaService } from "./mfa.service";

export class MfaController {
    private mfaService: MfaService;

    constructor(mfaService: MfaService) {
        this.mfaService = mfaService;
    }

    public generateMFAsetup = catchError(async (req, res) => {

        const userId = req.user?._id.toString();

        if (!userId) {
            throw new UnauthorizeException("UserId need please");
        }

        const { secret, qrCode, message } = await this.mfaService.generateMFAsetup(userId)

        return res.status(HTTPSTATUS.OK).json({
            message,
            secret,
            qrCode
        });
    }
    );

    public verifyMFAsetup = catchError(async (req, res) => {
        const { code, secretKey } = verifyMfaSchema.parse({
            ...req.body,
        });

        const userId = req.user?._id.toString();

        if (!userId) {
            throw new NotFoundException("User ID needed")
        }

        const { message, userPreferences } = await this.mfaService.verifyMFAsetup(userId, code, secretKey)


        return res.status(HTTPSTATUS.OK).json({
            message: message,
            userPreferences: userPreferences,
        });
    });

    public revokeMFA = catchError(async (req, res) => {
           
        const userId = req.user?._id.toString();

        if (!userId) {
            throw new BadRequestException("User id need please")
        }

       const {message, userPreferences} =  await this.mfaService.revokeMFA(userId);

        return res.status(HTTPSTATUS.OK).json({
            message,
            userPreferences
        });
    });

    public verifyLoginMfa = catchError(async (req, res) => {
        const { code, email, userAgent = "" } = verifyLoginMfaSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"] || ""
        });

       const {user, accessToken, refreshToken} = await this.mfaService.verifyLoginMfa(code, email, userAgent);

       return setAuthenticationCookies({
        res, accessToken, refreshToken
       }).status(HTTPSTATUS.OK).json({
        message: "Login successfully",
        user,
       });
    })
};