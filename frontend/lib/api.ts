import { API } from "./axios-client";



type LoginType = {
    email: string;
    password: string;
}

type RegisterType = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}


type ForgotPasswordType = {
    email: string;

}

type ResetPasswordType = {
    password: string;
    confirmPassword: string;
}

export type MfaType = {
    message: string
    secret: string;
    qrCode: string;
}

 

type MfaVerifyType = {
    secretKey: string;
    code: string;
}

type MfaVerifyLoginType = {
    code: string;
    email: string;
    userAgent?: string;
}

type SessionType = {
    _id: string;
    userId: string;
    userAgent: string;
    expiredAt: string;
    createdAt: string;
    updatedAt: string;
    isCurrent: boolean;
}


type SessionResponseType = {
    message: string;
    sessions: SessionType[]
}

export const loginMutationFn = async (data: LoginType) => await API.post("/auth/login", data);

export const registerMutationFn = async (data: RegisterType) => await API.post("/auth/register", data);

export const verifyEmailMutationFn = async (data: { code: string }) => await API.post("/auth/verify/email", data);

export const forgotPasswordMutationFn = async (data: ForgotPasswordType) => await API.post("/auth/forgot/password", data);

export const resetPasswordMutationFn = async (data: ResetPasswordType) => await API.post("/auth/reset/password", data);

export const logoutMutationFn =  async () => API.post('/auth/logout');

// session

export const getUserSessionQueryFn = async () => await API.get("/session/");


export const getAllUserSessionQueryFn = async () => {
   const response =  await API.get<SessionResponseType>("/session/all")
   return response.data;
}

export const sessionDeleteMutationFn = async (id: string) => 
    await API.delete(`/session/${id}`)
// mfa

export const mfaSetupQueryFn = async () => {
    const response = await API.get<MfaType>("/mfa/setup");
    return response.data;

}

export const mfaVerifyMutationFn = async (data: MfaVerifyType) => {
    const response = await API.post("/mfa/verify", data);
}

export const revokeMfaMutationFn = async () => await API.put("/mfa/revoke");


export const verifyLoginMfaMutationFn = async (data: MfaVerifyLoginType) => await API.post("/mfa/verify-login", data);