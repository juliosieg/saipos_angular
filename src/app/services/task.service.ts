import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  url = '/api/task';

  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getTasks(status: number): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.url + '/' + status)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  randomTasks() {
    return this.httpClient.get(this.url + '/randomTasks')
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  changeStatus(newStatus:number, id:number) {
    return this.httpClient.put(this.url + '/changeStatus', {newStatus, id})
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  create(value: any) {
    return this.httpClient.post(this.url, value)
      .pipe(
        catchError(this.handleError))
  }

  handleError(error: HttpErrorResponse) {
    return throwError({status: error.status, error: error.error});
  }
}
