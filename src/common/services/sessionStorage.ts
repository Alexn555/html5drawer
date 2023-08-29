export default class StorageHandler {
  save(key: string, value: string) {
    //save key from sesstion storage
    return sessionStorage.setItem(key, value);
  }

  getEl(key: string) {
    //fetching value from sesstion storage
    return sessionStorage.getItem(key);
  }

  remove(key: string) {
    //Removing username from sesstion storage
    sessionStorage.removeItem(key);
  }

  clearAll() {
    sessionStorage.clear();
  }
}
