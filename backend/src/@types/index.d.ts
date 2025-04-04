import { UserDocument } from "../database/models/user.models";
import { Request } from "express";

declare global {
    namespace Express {
        interface User extends UserDocument {}
        interface Request {
            sessionId?: string;
        }
    }
}