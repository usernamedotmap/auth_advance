
import axios from 'axios';

const options = {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true,
    timeout: 20000,
}

export const API = axios.create(options);

export const APIRefresh  = axios.create(options)

APIRefresh.interceptors.response.use((response) => {
    return response
})


API.interceptors.response.use((response) => {
    return response
},
    async (error) => {

        const { response } = error;

        if (!response) {
            console.log("response: ", response)
            console.log(error)
            return Promise.reject("Error...basta")
        }

        const { data, status } = error.response;

        if (data.errorCode === "AUTH_TOKEN_NOT_FOUND" && status === 401) {
            try {
                await APIRefresh.get("/auth/refresh");
                return APIRefresh(error.config)
            } catch (error) {
                window.location.href = "/"
            }

        }
        return Promise.reject({
            ...data
        })
    }
);

