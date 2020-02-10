import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root"
})
export class OfflineService {
  constructor(private storage: Storage) {}

  setValues(key, value) {
    return new Promise((resolve,reject)=>{
      this.storage.set(key, value);
    })
    
  }

  getValues(key) {
    return new Promise((resolve,reject)=>{
      let res = this.storage.get(key);
    if(res){resolve(res)}else {reject([])};
    })
   
  }
}
