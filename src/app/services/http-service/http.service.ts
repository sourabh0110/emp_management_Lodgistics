import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { AppConfig } from '../app-config';

@Injectable({
  providedIn: 'root'
})
export class HttpService { 
  /**
   * Http options
   */
  private httpOptions:any;
  /**
   * Api URL
   */
  private apiUrl:any;
  constructor(private http: HttpClient) {
    this.apiUrl = AppConfig.fetch_data_url;
    this.httpOptions = AppConfig.headers;
   }
   /**
    * To handle HttpErrorResponse
    * @param error HttpErrorResponse
    */
   handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
  /**
   * To extract data from api
   * @param res res to return
   */
  private extractData(res: any) {
    let body = res;
    return body || { };
  }
  /**
   * Get list of employees
   */
  getEmp(): Observable<any> {
    return this.http.get(this.apiUrl, this.httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
}