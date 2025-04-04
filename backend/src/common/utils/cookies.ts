import { CookieOptions, Response } from "express";
import { config } from "../../config/app.config";
import { calculateExpiresDate } from "./date";

type CookiePayLoadType = {
    res: Response;
    accessToken: string;
    refreshToken: string;
};

export const REFRESH_PATH = `${config.BASE_PATH}/auth/refresh`;

const defaults: CookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production" ? true : false,
    sameSite: "strict",
};

export const getRefreshTokenCookieOption = (): CookieOptions => {
    const expiresIn = config.JWT.REFRESH_EXPIRES_IN;
    const expires = calculateExpiresDate(expiresIn);

    return {
        ...defaults,
        expires,
        path: REFRESH_PATH,
    };
};

export const getAccessTokenCookieOption = (): CookieOptions => {
    const expiresIn = config.JWT.EXPIRES_IN as string;
    const expires = calculateExpiresDate(expiresIn);

    return {
        ...defaults,
        expires,
        path: "/",
    };
};


export const setAuthenticationCookies = ({ res, accessToken, refreshToken}:CookiePayLoadType):Response  => {
    res.cookie("accessToken", accessToken, getAccessTokenCookieOption())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOption());
    return res;
};

export const clearAuthenticationCookies = (res: Response): Response => {
    res.clearCookie("accessToken")
    .clearCookie("refreshToken", {
        path: REFRESH_PATH,
    });
    return res;
};