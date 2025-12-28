import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { apiConfig } from "../config";
import { Keycloak } from "@utils/keycloak";

// === DEFAULT SETUP === //
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.get["Access-Control-Allow-Origin"] = "*";
axios.defaults.baseURL = apiConfig.BASE_URL;

const tokenTemp = window.localStorage.getItem("accessToken");
axios.defaults.headers.common["Authorization"] = `Bearer ${tokenTemp}`;

// Response Interceptor
axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            const path = window.location.pathname;
            const query = window.location.search;
            const fullPath = path + query;
            Keycloak.signIn(fullPath)
        }

        return Promise.reject(error);
    }
);

// === API WRAPPER === //
class APICore {
    get = ( url: string, params?: Record<string, any>, config?: AxiosRequestConfig<any> ): Promise<AxiosResponse> => {
        return axios.get(url, {
            ...params,
            ...config,
        });
    };

    post = ( url: string, body?: Record<string, any>, config?: AxiosRequestConfig<any> ): Promise<AxiosResponse> => {
        return axios.post(url, body, {
            withCredentials: false,
            validateStatus: () => true,
            ...config,
        });
    };

    put = ( url: string, body?: Record<string, any>, config?: AxiosRequestConfig<any> ): Promise<AxiosResponse> => {
        return axios.put(url, body, {
            withCredentials: false,
            validateStatus: () => true,
            ...config,
        });
    };

    delete = ( url: string, config?: AxiosRequestConfig<any> ): Promise<AxiosResponse> => {
        return axios.delete(url, {
            withCredentials: false,
            validateStatus: () => true,
            ...config,
        });
    };
}

export { APICore };
