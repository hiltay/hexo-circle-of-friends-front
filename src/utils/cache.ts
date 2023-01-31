interface Store {
  data: Object,
  expire_days: number,
  create_time: number
}
function diffdays(date1: number, date2: number) {
  let timesDiff = Math.abs(date1 - date2);
  return Math.floor(timesDiff / (1000 * 60 * 60 * 24));
}


function isexpired(store: Store): boolean {
  if (store.expire_days === -1) {
    // never expire
    return false;
  }
  return store.expire_days <= diffdays(new Date().getTime(), store.create_time);
}


class Cache {
  setCache(key: string, value: any, isSessionStorage?: boolean, expire_days: number = -1) {
    if (isSessionStorage) {
      if (value) {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      }
    } else {
      // 默认使用localStorage
      if (value) {
        let store = {
          data: value,
          expire_days: expire_days,
          create_time: new Date().getTime()
        };
        window.localStorage.setItem(key, JSON.stringify(store));
      }
    }
  }

  getCache(key: string, isSessionStorage?: boolean) {
    if (isSessionStorage) {
      const value = window.sessionStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      }
    } else {
      let result = window.localStorage.getItem(key);
      if (result) {
        let store: Store = JSON.parse(result);
        if (isexpired(store)) {
          this.deleteCache(key)
        }
        else {
          return store.data;
        }
      }
    }
  }

  deleteCache(key: string, isSessionStorage?: boolean) {
    if (isSessionStorage) {
      window.sessionStorage.removeItem(key);
    } else {
      window.localStorage.removeItem(key);
    }
  }

  clearCache() {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
}

export default new Cache();
