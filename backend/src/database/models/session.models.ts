import mongoose, { Schema } from "mongoose";
import { thirtyDaysFromNow } from "../../common/utils/date";


export interface SessionDocument extends Document {
    _id: mongoose.Types.ObjectId | string;
    userId: mongoose.Types.ObjectId;
    userAgent?: string;
    expiredAt: Date;
    createdAt: Date;
}

const sessionSchema = new Schema<SessionDocument>({
    userId: { type: Schema.Types.ObjectId, index: true, required: true, ref: "User" },
    userAgent: {type: String,  required: false, optional: true},
    createdAt: { type: Date, default: Date.now },
    expiredAt: { type: Date, required: true, default: thirtyDaysFromNow},
}
);

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;

