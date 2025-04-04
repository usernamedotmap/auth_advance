import { ExtractJwt, StrategyOptionsWithRequest, Strategy as JwtStrategy } from "passport-jwt";
import { UnauthorizeException } from "../utils/catch-error";
import { ErrorCode } from "../enums/errorCode";
import { config } from "../../config/app.config";
import passport, { PassportStatic } from "passport";
import { userService } from "../../modules/user/user.module";


interface JwtPayload {
    userId: string;
    sessionId: string;
}


const options: StrategyOptionsWithRequest = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
            const accessToken = req.cookies.accessToken;
            if (!accessToken) {
                throw new UnauthorizeException("Unauthorized access token", ErrorCode.AUTH_TOKEN_NOT_FOUND);
            }
            return accessToken;
        },
    ]),

    secretOrKey: config.JWT.SECRET,
    audience: ["user"],
    algorithms: ["HS256"],
    passReqToCallback: true,
};

export const setupJwtStrategy = (passportArg: PassportStatic) => {
    passportArg.use(new JwtStrategy(options, async (req, payload: JwtPayload, done) => {
        try {
            const user = await userService.findUserById(payload.userId);

            if (!user) {
                return done(null, false)
            }

            req.sessionId = payload.sessionId;
            
            return done(null, user)
        } catch (error) {
            console.log("Error in passport", error);
            return done(error, false);
        }
    }));
};

export const authenticateJWT = passport.authenticate("jwt", { session: false });