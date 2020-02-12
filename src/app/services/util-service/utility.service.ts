import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  makeThumbnail(imageUrl: string, height: number, width: number, quality: number, mime_type: any): Promise<any> {
    let natW = width;//image.naturalWidth;
    let natH = height;//image.naturalHeight;
    let image = new Image;
    return new Promise((resolve, reject) => {
      image.onload = (() => {
        let cvs = document.createElement('canvas');
        cvs.width = natW;
        cvs.height = natH;
        cvs.getContext("2d").drawImage(image, 0, 0, natW, natH);
        try {
          let blob = this.dataURLtoBlob(cvs.toDataURL(mime_type, quality / 100));
          resolve(blob);
        }
        catch (err) {
          reject(err);
        }

      });
      image.src = imageUrl;
    });

  }

  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
}
