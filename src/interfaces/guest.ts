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


