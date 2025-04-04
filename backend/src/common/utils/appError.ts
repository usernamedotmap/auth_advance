import {  HttpStatusCode } from "../../config/http";
import { ErrorCode } from "../enums/errorCode";

export class AppError extends Error {
    public statusCode: HttpStatusCode;
    public errorCode?: ErrorCode;

    constructor(message: string, statusCode: HttpStatusCode, errorCode: ErrorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}