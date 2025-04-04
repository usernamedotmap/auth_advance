import { ErrorRequestHandler, Response } from "express";
import { HTTPSTATUS } from "../config/http";
import { AppError } from "../common/utils/appError";
import { z } from "zod";
import { clearAuthenticationCookies, REFRESH_PATH } from "../common/utils/cookies";


const formatZodError = (res: Response, error: z.ZodError) => {
    const errors = error?.issues?.map((err) => ({
        field: err.path.join("."),
        message: err.message
    }));
    
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation error",
        errors: errors
    });
};


export const errorHandler: ErrorRequestHandler = (err, req, res, next): any => {
    console.error(`Errror in: ${req.path}`, err);

    if (req.path === REFRESH_PATH) {
        clearAuthenticationCookies(res);
    }

    if (err instanceof SyntaxError) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid JSON payload passed.",
            error: err?.message
        });
    };

    if (err instanceof z.ZodError) {
        return formatZodError(res, err);
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            errorCode: err.errorCode
        });
    };

    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal server errror",
        error: err?.message
    });
};