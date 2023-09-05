export default class StorageHandler {

  private static _instance: StorageHandler = new StorageHandler();
    
  constructor() {
    if(StorageHandler._instance){
        throw new Error("Error: Instantiation failed: Use StorageHandler.getInstance() instead.");
    }
    StorageHandler._instance = this;
  }

  static getInstance(): StorageHandler {
    return StorageHandler._instance;
  }
  
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