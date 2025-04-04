import {z} from 'zod'

export const RegisterSchema = z.object({
    name: z.string().trim().min(3).max(255),
    email: z.string().email().min(3).max(255),
    password: z.string().trim().min(6).max(255),
    confirmPassword: z.string().trim().min(6).max(255),
}).refine((val) => val.password === val.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const loginSchema = z.object({
    email: z.string().email().min(3).max(255),
    password: z.string().min(6),
    userAgent: z.string().optional(),
});

export const verificationCodeSchema =  z.string().trim().min(1).max(30);

export const verificationEmailSchema = z.object({
    code: verificationCodeSchema,
});

export const emailSchema = z.string().trim().min(3).max(255);
export const resetPasswordSchema = z.object({
    password: z.string().trim().min(3).max(255),
    verificationCode: z.string().trim().min(3).max(255)
})