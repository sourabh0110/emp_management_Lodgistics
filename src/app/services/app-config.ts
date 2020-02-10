import { HttpHeaders } from '@angular/common/http';

export const AppConfig = {
  fetch_data_url : "http://dummy.restapiexample.com/api/v1/employees",
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}   