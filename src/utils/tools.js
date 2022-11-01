function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let index = 0; index < keys1.length; index++) {
    const val1 = object1[keys1[index]];
    const val2 = object2[keys2[index]];
    if(val1!==val2){
      return false;
    }
  }

  return true;
}


export function init_header(token) {
  // 初始化请求头
  return {
    "headers": {
      "Authorization": token
    }
  }
}

export function get_cache_token() {
  // 获取本地存储的token
  if (localStorage.getItem('fcircle-token')) {
    return 'Bearer ' + localStorage.getItem('fcircle-token');
  }
  return ''
}


export function arraydeepEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }
  // equal length
  for (let i = 0; i < array1.length; i++) {
      if(!deepEqual(array1[i], array2[i])){
        return false;
      }
  }
  return true;

}