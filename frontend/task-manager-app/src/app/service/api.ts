import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private Api_url ="http://localhost:3030/api";

  private tasksUpdated = new BehaviorSubject<boolean>(false);
  tasksUpdated$ = this.tasksUpdated.asObservable();

  refreshTasks() {
    this.tasksUpdated.next(true);
  }

  constructor(private http: HttpClient){
    
  }

  saveToken(token: string): void{
    localStorage.setItem("token",token);
  }

  getToken(): string | null{
    return localStorage.getItem("token");
  }

  isAuthenticated(): boolean{
    return !!localStorage.getItem("token");
  }

  logOut(): void{
    localStorage.removeItem("token");
  }

  private getHeader():HttpHeaders{
    const token = this.getToken();
    return new HttpHeaders({
      Authorization:`Bearer ${token}`,
      "Content-Type":"application/json"
    });
  }


  registerUser(body:any): Observable<any>{
    return this.http.post(`${this.Api_url}/auth/register`,body);
  }

  loginUser(body:any): Observable<any>{
    return this.http.post(`${this.Api_url}/auth/login`,body);
  }

  createTask(body: any): Observable<any> {
    return this.http.post(`${this.Api_url}/tasks`, body, {
      headers: this.getHeader()
    });
  }

  updateTask(body: any): Observable<any> {
    return this.http.put(`${this.Api_url}/tasks`, body, {
      headers: this.getHeader()
    });
  }

  getAllMyTasks(): Observable<any> {
    return this.http.get(`${this.Api_url}/tasks`, {
      headers: this.getHeader()
    });
  }

  getTaskById(taskId: string): Observable<any> {
    return this.http.get(`${this.Api_url}/tasks/${taskId}`, {
      headers: this.getHeader()
    });
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.Api_url}/tasks/${taskId}`, {
      headers: this.getHeader()
    });
  }

  getMyTasksByCompletionStatus(completed: boolean): Observable<any> {
    return this.http.get(`${this.Api_url}/tasks/status`, {
      headers: this.getHeader(),
      params: {
        completed: completed
      }
    });
  }

  getMyTasksByPriority(priority: string): Observable<any> {
    return this.http.get(`${this.Api_url}/tasks/priority`, {
      headers: this.getHeader(),
      params: {
        priority: priority
      }
    });
  }
}
