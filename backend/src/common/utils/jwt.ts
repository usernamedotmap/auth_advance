import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { SessionDocument } from "../../database/models/session.models";
import { UserDocument } from "../../database/models/user.models";
import { config } from "../../config/app.config";



export type accessTokenPayload = {
    userId: UserDocument["_id"],
    sessionId: SessionDocument["_id"],
};


export type refreshTokenPayload = {
    sessionId: SessionDocument["_id"],
};

type SignOptAndSecret = SignOptions & {
    secret: string;
};

const defaults: SignOptions = {
    audience: ["user"],
};

export const accessTokenSignOptions: SignOptAndSecret = {
    expiresIn: "1h",
    secret: config.JWT.SECRET,
    ...defaults,
};

export const refreshTokenSignOptions: SignOptAndSecret = {
    expiresIn: "30d",
    secret: config.JWT.REFRESH_SECRET,
};

export const SignJwtToken = (
    payload: accessTokenPayload | refreshTokenPayload,
    options?: SignOptAndSecret,
) => {
    const { secret, ...opts } = options || accessTokenSignOptions;

    return jwt.sign(payload, secret, {
        ...defaults,
        ...opts
    });
};

    export const verifyJwtToken = <TPayload extends object = accessTokenPayload> (token: string, options?: VerifyOptions & { secret: string }) => {
        try {
            const { secret = config.JWT.SECRET, ...opts } = options || {};
           const  payload = jwt.verify(token, secret, {
                ...defaults,
                ...opts,
            }) as TPayload;
            
            return { payload };
        } catch (error: any) {
            return {
            error: error.message
            }
        }
    };