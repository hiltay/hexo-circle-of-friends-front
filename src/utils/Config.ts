/*
 * @Author: yyyz && 904108079@qq.com
 * @Date: 2023-02-02 22:01:24
 * @LastEditors: yyyz && 904108079@qq.com
 * @LastEditTime: 2023-02-07 21:48:35
 * @FilePath: \hexo-circle-of-friends-front\src\utils\Config.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by yyyz, All Rights Reserved. 
 */
let DefaultConfig = {
  // private_api_url: 'https://fcircle.yyyzyyyz.cn',
  private_api_url: 'http://127.0.0.1:8000/',
  public_api_url: "https://fcircle-pub.rct.cool/",
  page_init_number: 20,
  page_turning_number: 10,
  error_img: "https://sdn.geekzu.org/avatar/57d8260dfb55501c37dde588e7c3852c",
  sort_rule: "created",
  expire_days: 1, // 本地文章缓存数据过期时间（天）
};
export default DefaultConfig;

// //默认数据
// var fdata = {
//   jsonurl: '',
//   apiurl: '',
//   apipublieurl: 'https://fcircle-pub.rct.cool/', //默认公共库
//   initnumber: 20,  //首次加载文章数
//   stepnumber: 10,  //更多加载文章数
//   article_sort: 'created', //文章排序 updated or created
//   error_img: 'https://sdn.geekzu.org/avatar/57d8260dfb55501c37dde588e7c3852c'
// }
