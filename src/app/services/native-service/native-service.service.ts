declare var window: any;
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';

@Injectable({
    providedIn: 'root'
})
export class NativeServiceService {

    constructor(private file: File, private filePath: FilePath, private camera: Camera, private platform: Platform) { }
     /**
* This method is used to take photo from Camera or gallary
* We  have used ionic {@link http://ionicframework.com/docs/v2/native/camera/ cordova-plugin-camera } and {@link http://ionicframework.com/docs/v2/native/filepath cordova-plugin-filepath}  plugin.
* @param {number} destinationType
* Pass destinationType 0:DATA_URL 1: Return image as base64-encoded string 2. Return image file URI
* @param {number} sourceType
* Pass sourceType PHOTOLIBRARY : 0, CAMERA : 1, SAVEDPHOTOALBUM : 2
* @param {number} encodingType
* Pass encodingType JPEG : 0 PNG : 1
* @param {Object} size
* Pass dimention for image
* @param {number} quality
* Pass quality for image from 0-100
* @example
* takePicture(2,1,1,{width:1024,height:800},80)
* @returns  {Promise}
* Return Pormise with image data
*/

    /*use for take photo from Camera or gallary*/
    takePicture(destinationType: number, sourceType: number, encoding: number, size: any, quality: number): Promise<any> {
        let options: any = {
            //Save photo to gallery
            //saveToPhotoAlbum: true,
            //destinationType 0:DATA_URL 1: Return image as base64-encoded string 2. Return image file URI
            destinationType: destinationType,
            //sourceType PHOTOLIBRARY : 0, CAMERA : 1, SAVEDPHOTOALBUM : 2
            sourceType: sourceType,
            //encodingType JPEG : 0 PNG : 1
            encodingType: encoding,
            //quality range from 0 to 100 and default 50
            quality: quality,
            targetWidth: size.width,
            targetHeight: size.height,
            MediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            allowEdit: false
        };
        return this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            return new Promise((resolve, reject) => {
                if (this.platform.is("android") && sourceType != 1 && destinationType == 1) {
                    this.filePath.resolveNativePath(imageData).then(filePath => {
                        console.log(filePath);
                        resolve(filePath);
                    }, err => {
                        console.log(err);
                        reject(err);
                    })
                } else {
                    resolve(imageData);
                }
            })
        }, (err) => {
            // Handle error
            console.log(err);
            return Promise.reject(err);
        });
    }

    /**
      * This method is used to create new directory in local file system
      * We have used ionic {@link http://ionicframework.com/docs/v2/native/file/ cordova-plugin-file}  plugin
      * @param {string} dirName
      * Pass directory name
      * @example
      * createDirectory("image");
      * @returns  {Promise}
      * Return Pormise with directory created or not
      */
     createDirectory(dirName): Promise<any> {
        return new Promise((resolve, reject) => {
            this.platform.ready().then(() => {
                if (!window.cordova) {
                    reject("cordova not defined");
                } else {
                    let fs = this.file.dataDirectory;
                    this.file.createDir(fs, dirName, false).then(() => {
                        resolve("created");
                        console.log('created')
                    }, err => {
                        reject(err);
                        console.log(err);
                    }
                    ).catch(err => {
                        reject(err);
                        console.log('Error', err);
                    });
                }
            })

        })
    }


    /**
      * This method is used to move local file from one location to another
      * We have used ionic {@link http://ionicframework.com/docs/v2/native/file/ cordova-plugin-file}  plugin
      * @param {string} sourcePath
      * Pass source path of file
      * @param {string} destPath
      * Pass destination path of file
      * @param {string} soureceFileName
      * Pass source  file name
      * @param {string} destFileName
      * Pass destination file name
      * @example
      * moveFile("file:/temp/image","image","3453264.png","ghjgyuireth567347.png");
      * @returns  {Promise}
      * Return Pormise with moved file path
      */
    //used to move local file from one location to another
    moveFile(fromPath, toPath, fileName, newFileName) {
        return new Promise((resolve, reject) => {
            if (!window.cordova) {
                reject("cordova not defined");
            } else {
                let fs;
                // if(cordova.file){
                //     fs = this.file.dataDirectory;
                // }
                // else{
                //     fs = cordova.dataDirectory;
                // }

                fs = this.file.dataDirectory;
                let newPath = fs + toPath + "/";
                console.log("moveFile", fromPath, fileName, newPath, newFileName);
                this.file.moveFile(fromPath, fileName, newPath, newFileName).then((entry) => {
                    console.log(entry);
                    console.log("moveFile resolve", newPath + newFileName);
                    // set Timeout to upload to local device
                    setTimeout(() => {
                        resolve(newPath + newFileName);
                    }, 2000)

                }, err => {
                    reject(err)
                })
            }

        });

    }


    /**
      * This method is used to copy local file from one location to another
      * We have used ionic {@link http://ionicframework.com/docs/v2/native/file/ cordova-plugin-file}  plugin
      * @param {string} sourcePath
      * Pass source path of file
      * @param {string} destPath
      * Pass destination path of file
      * @param {string} soureceFileName
      * Pass source  file name
      * @param {string} destFileName
      * Pass destination file name
      * @example
      * copyFile("file:/temp/image","image","3453264.png","ghjgyuireth567347.png");
      * @returns  {Promise}
      * Return Pormise with copied file path
      */
    //used to copy local file from one location to another
    copyFile(fromPath, toPath, fileName, newFileName) {
        return new Promise((resolve, reject) => {
            if (!window.cordova) {
                reject("cordova not defined");
            } else {
                let fs = this.file.dataDirectory;
                let newPath = fs + toPath + "/";
                this.file.copyFile(fromPath, fileName, newPath, newFileName).then((entry) => {
                    resolve(entry);
                }, err => {
                    reject(err)
                })
            }
        });
    }


    /**
      * This method is used to remove file from local directory
      * We have used ionic {@link http://ionicframework.com/docs/v2/native/file/ cordova-plugin-file}  plugin
      * @param {string} filePath
      * Pass path of file
      * @param {string} fileName
      * Pass file name
      * @example
      * removeFile("image","ghjgyuireth567347.png");
      * @returns  {Promise}
      * Return Pormise with file removed or not
      */
    //permanant remove the file from local directory
    removeFile(path, fileName) {
        return new Promise((resolve, reject) => {
            if (!window.cordova) {
                reject("cordova not defined");
            } else {
                if (this.platform.is("ios")) {
                    let spliter = path.split("/");
                    let fileName = spliter.pop();
                    let filePath = this.getFileRootPath() + spliter.join("/");
                    this.file.removeFile(filePath, fileName).then(_ => {
                        resolve('');
                    }, err => {
                        resolve('');
                    })
                }
                else {
                    let fs = this.file.dataDirectory;
                    let newPath = fs + path + "/";
                    this.file.removeFile(newPath, fileName).then((entry) => {
                        resolve(entry);
                    }, err => {
                        reject(err)
                    })
                }
            }
        });
    }
    /**
    * to get root path of the file
    * @returns {string} will document directory
    */
    getFileRootPath() {
        if (this.platform.is('ios')) {
            return this.file.documentsDirectory;
        } else {
            return this.file.externalApplicationStorageDirectory;
        }
    }
    /**
      * This method is used to file path on local
      * We have used ionic {@link http://ionicframework.com/docs/v2/native/file/ cordova-plugin-file}  plugin
      * @param {string} filePath
      * Pass path of file
      * @param {string} fileName
      * Pass file name
      * @example
      * removeFile("image","ghjgyuireth567347.png");
      * @returns  {Promise}
      * Return Pormise with local file path
      */
    getFileUrl(path, fileName) {
        return new Promise((resolve, reject) => {
            if (!window.cordova) {
                reject("cordova not defined");
            } else {
                let fs = this.file.dataDirectory;
                let newPath = fs + path + "/" + fileName;
                resolve(newPath);
            }
        });
    }


    /**
      * This method is used to write blob on local device
      * We have used ionic {@link http://ionicframework.com/docs/v2/native/file/ cordova-plugin-file}  plugin
      * @param {string} filePath
      * Pass path of file
      * @param {string} fileName
      * Pass file name
      * @example
      * writeBlobFile("image","ghjgyuireth567347.png",blob);
      * @returns  {Promise}
      * Return Pormise with local file path
      */
    //create new image file using blob
    writeBlobFile(path, fileName, blob) {
           return new Promise((resolve, reject) => {
            let options: IWriteOptions;
            if (!window.cordova) {
                reject("cordova not defined");
            } else {
                let fs = this.file.dataDirectory;
                let newPath = fs + path + "/";
                this.file.writeFile(newPath, fileName, blob, options).then((entry) => {
                    // setTimeout(()=>{
                    //     console.log(entry);
                    //     resolve(newPath + fileName);
                    // },3000)
                    console.log(entry);
                    resolve(newPath + fileName);
                }, (err) => {
                    console.log(err);
                    reject("error");
                })
            }
        });

    }

    /**
      * This method is used to check file present or not
      * We have used ionic {@link http://ionicframework.com/docs/v2/native/file/ cordova-plugin-file}  plugin
      * @param {string} filePath
      * Pass path of file
      * @param {string} fileName
      * Pass file name
      * @example
      * checkFile("image","ghjgyuireth567347.png");
      * @returns  {Promise}
      * Return Pormise with local file path if exits.
      */
    // check file present on device or not
    checkFile(path, fileName) {
        return new Promise((resolve, reject) => {
            if (!window.cordova) {
                reject("cordova not defined");
            } else {
                let fs = this.file.dataDirectory;
                let newPath = fs + path + "/";
                this.file.checkFile(newPath, fileName).then((isExists) => {
                    console.log(isExists);
                    resolve(newPath + fileName);
                }, (err) => {
                    reject("error");
                })
            }
        });
    }


    /**
      * This method is used to get file in blob format
      * We have used ionic {@link http://ionicframework.com/docs/v2/native/file/ cordova-plugin-file}  plugin
      * @param {string} filePath
      * Pass path of file
      * @param {string} fileName
      * Pass file name
      * @example
      * getBlob("image","ghjgyuireth567347.png");
      * @returns  {Promise}
      * Return Pormise with blob.
      */
    getBlob(path, filename) {
        return new Promise((resolve, reject) => {
            if (!window.cordova) {
                reject("cordova not defined");
            } else {
                let fs = this.file.dataDirectory;
                let newPath = fs + path + "/";
                console.log(newPath, filename, "getblob");
                this.file.readAsArrayBuffer(newPath, filename).then((arraBuffer) => {
                    let blob = new Blob([arraBuffer], { type: 'image/png' });
                    resolve(blob);
                }, err => {
                    reject(err)
                })
            }
        });

    }

}
