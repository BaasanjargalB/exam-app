import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private baseUrl: string = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  getTeachers() {
    return this.http.get(`${this.baseUrl}user/teacher/all`);
  }
}
