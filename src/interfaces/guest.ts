import { request_default } from "./index";

export function getAllArticleInfo(url: string, rule: string) {
    return request_default.get({
        url: url + "all?rule=" + rule,
    });
}


export function getArticleCardInfo(url: string, link?: string) {
    if (link) {
        return request_default.get({
            url: url + "post?num=5&link=" + link,
        });
    }
    else {
        return request_default.get({
            url: url + "post?num=5",
        });
    }
}

export function getArticleSummary(url: string, link: string) {
    return request_default.get({
        url: url + "summary?link=" + encodeURIComponent(link),
    });
}

export function getRandomPost(url: string, num: number = 1) {
    return request_default.get({
        url: url + "randompost?num=" + num,
    });
}

export function getVersion(url: string) {
    return request_default.get({
        url: url + "version",
    });
}

export function getLatestVersion() {
    return request_default.get({
        url: "https://fcircle-doc.yyyzyyyz.cn/version.txt",
    });
}


