import { HttpHeaders } from '@angular/common/http';

export const AppConfig = {
  fetch_data_url : "http://dummy.restapiexample.com/api/v1/employees",
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  cameraProperties: {
    destinationType: {
      BASE64: 0,
      FILEURI: 1,
      NATIVE_URI: 2
    },
    sourceType: {
      PHOTOLIBRARY: 0,
      CAMERA: 1,
      SAVEDPHOTOALBUM: 2
    },
    encoding: {
      JPEG: 0,
      PNG: 1
    },
    imageSize: {
      width: 1024,
      height: 800
    },
    androidquality: 30,
    iosquality: 10
  },
  mediaFormats: {
    imagePng: { contentType: 'image/png' },
    imageJpeg: { contentType: 'image/jpeg' }
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    quality: 30
  },
  directory: {
    image: "image"
  },
}   