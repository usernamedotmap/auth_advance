import { HTTPSTATUS, HttpStatusCode } from "../../config/http";
import { ErrorCode } from "../enums/errorCode";
import { AppError } from "./appError";


export class NotFoundException extends AppError {
    constructor(message = "Resource not found", errorCode?: ErrorCode) {
        super(message, HTTPSTATUS.NOT_FOUND, errorCode || ErrorCode.RESOURCE_NOT_FOUND);
    }
}

export class BadRequestException extends AppError {
    constructor(message = "Bad Request", errorCode?: ErrorCode) {
        super(message, HTTPSTATUS.BAD_REQUEST, errorCode || ErrorCode.VALIDATION_ERROR);
    }
}

export class UnauthorizeException extends AppError {
    constructor(message = "Unauthorized Access", errorCode?: ErrorCode) {
        super(message, HTTPSTATUS.UNAUTHORIZED, errorCode || ErrorCode.ACCESS_UNAUTHORIZED);
    }
}

export class IntervalServerError extends AppError {
    constructor(message = "Internal Server Error", errorCode?: ErrorCode) {
        super(message, HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode || ErrorCode.INTERNAL_SERVER_ERROR);
    }
}



export class HttpException extends AppError {
    constructor(message = "Http Server Error", statusCode: HttpStatusCode, errorCode?: ErrorCode) {
        super(message, statusCode, errorCode || ErrorCode.INTERNAL_SERVER_ERROR);
    }
}   