import { request_default, request_auth } from "./index";


export function manageLogin(url: string, password: string) {
    return request_default.post<any>({
        url: url + "login",
        data: {
            password,
        },
    });
}

export function loginWithToken(url: string) {
    return request_auth.get<any>({
        url: url + "login_with_token"
    });
}