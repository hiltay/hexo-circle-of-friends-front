export function init_header(token){
  // 初始化请求头
  return {
    "headers":{
      "Authorization":token
    }
  }
}

export function get_cache_token(){
  // 获取本地存储的token
  if (localStorage.getItem('fcircle-token')) {
    return 'Bearer ' + localStorage.getItem('fcircle-token');
  }
  return ''
}
