import mongoose, { Schema } from "mongoose";
import { VerificationEnum } from "../../common/enums/verificationEnum";
import { generateUniqueCode } from "../../common/utils/uuid";



export interface VerificationCodeDocument extends Document {
    userId: mongoose.Types.ObjectId;
    code: string;
    type: VerificationEnum;
    expiredAt: Date;
    createdAt: Date;
};

const verificationSchema = new Schema<VerificationCodeDocument>({
    userId: { type: Schema.Types.ObjectId, index: true, required: true, ref: "User" },
    code: { type: String, required: true, unique: true, default: generateUniqueCode },
    type: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiredAt: { type: Date, required: true, }
});


const VerificationCodeModel = mongoose.model<VerificationCodeDocument>("VerificationCode", verificationSchema, "verification_codes");

export default VerificationCodeModel;