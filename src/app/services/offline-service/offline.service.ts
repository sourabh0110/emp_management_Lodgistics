import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root"
})
export class OfflineService {
  constructor(private storage: Storage) {}
  /**
   * To store values
   * @param key Key to store
   * @param value Value of key
   */
  setValues(key, value) {
    return new Promise((resolve,reject)=>{
      this.storage.set(key, value);
    })
    
  }
  /**
   * To get values from Key
   * @param key getting value from key
   */
  getValues(key) {
    return new Promise((resolve,reject)=>{
      let res = this.storage.get(key);
    if(res){resolve(res)}else {reject([])};
    })
   
  }
}
