import { request_default, request_auth } from "./index";
export { request_default }

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


export function readSettings(url: string) {
    return request_auth.get<any>({
        url: url + "read_settings"
    });
}

export function backendVersion(url: string) {
    return request_default.get<any>({
        url: url + "version"
    });
}

export function updateSettings(url: string, settings: any) {
    return request_auth.put<any>({
        url: url + "update_settings",
        data: {
            ...settings,
        },
    });
}

export function dbReset(url: string,) {
    return request_auth.delete<any>({
        url: url + "db_reset",
    });
}
export function apiRestart(url: string,) {
    return request_auth.get<any>({
        url: url + "restart_api",
    });
}

export function updateGithubEnv(url: string, settings: any) {
    return request_auth.put<any>({
        url: url + "update_github_env",
        data: {
            ...settings,
        },
    });
}

export function updateVercelEnv(url: string, settings: any) {
    return request_auth.put<any>({
        url: url + "update_vercel_env",
        data: {
            ...settings,
        },
    });
}


export function updateServerEnv(url: string, settings: any) {
    return request_auth.put<any>({
        url: url + "update_server_env",
        data: {
            ...settings,
        },
    });
}

export function readEnvs(url: string,) {
    return request_auth.get<any>({
        url: url + "read_envs",
    });
}


export function runCrawlNow(url: string,) {
    return request_auth.get<any>({
        url: url + "run_crawl_now",
    });
}

export function getCrawlerStatus(url: string,) {
    return request_auth.get<any>({
        url: url + "crawler_status",
    });
}

export function downloadLogs(url: string,) {
    return request_auth.get<any>({
        url: url + "download_logs",
    });
}



