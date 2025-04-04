import { z } from "zod";
import { NotFoundException } from "../common/utils/catch-error";
import { HTTPSTATUS } from "../config/http";
import { catchError } from "../middleware/catchError";
import { SessionService } from "./session.service";


export class SessionController {
    private sessionService: SessionService;

    constructor(sessionService: SessionService) {
        this.sessionService = sessionService;
    }

    public getAllSession = catchError(async (req, res) => {
        const userId = req.user?._id?.toString();
        const sessionId = req.sessionId;

        if (!userId) {
            throw new NotFoundException("User ID is required");
        }

        const { sessions } = await this.sessionService.getAllSession(userId);

        const modifySessions = sessions.map((session) => ({
            ...session.toObject(),
            ...(session._id.toString() === sessionId?.toString() && {
                isCurrent: true,
            }),
        }));


        return res.status(HTTPSTATUS.OK).json({
            message: "Retrieved all session successfully",
            sessions: modifySessions,
        });
    });

    public getSession = catchError(async (req, res) => {
        const sessionId = req?.sessionId;

        if (!sessionId) {
            throw new NotFoundException("Session ID not found. Please login first")
        }

        const { user } = await this.sessionService.getSessionById(sessionId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Session retrieved successfully",
            user,
        });
    });


    public deleteSession = catchError(async (req, res) => {


        const sessionId = z.string().parse(req.params.id);
        const userId = req.user?._id.toString();
        
    

        if (!userId) {
            throw new NotFoundException("User id please");
        }

        await this.sessionService.deleteSession(userId, sessionId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Session deleted successfully"
        });
    });


};