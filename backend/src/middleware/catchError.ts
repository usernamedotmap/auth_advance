import { NextFunction, Request, Response } from "express";


type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const catchError = (controller: AsyncController): AsyncController => async (req, res, next) => {
    try {
        return await controller(req, res, next);
    } catch (error) {
        next(error);
    }

}