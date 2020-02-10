import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { AppConfig } from '../app-config';

@Injectable({
  providedIn: 'root'
})
export class HttpService { 
  private httpOptions:any;
  private apiUrl:any;
  constructor(private http: HttpClient) {
    this.apiUrl = AppConfig.fetch_data_url;
    this.httpOptions = AppConfig.headers;
   }
  private handleError(error: HttpErrorResponse) {
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
  
  private extractData(res: any,id?) {
    let body = res;
    return body || { };
  }

  getClassroom(): Observable<any> {
    return this.http.get(this.apiUrl, this.httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  
  getEmpById(id: string): Observable<any> {
    // const url = `${this.apiUrl}/${id}`;
    return this.http.get(this.apiUrl, this.httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  
  postEmp(data): Observable<any> {
    const url = `${this.apiUrl}/add_with_students`;
    return this.http.post(url, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  updateEmp(id: string, data): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  deleteClassroom(id: string): Observable<{}> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
}
