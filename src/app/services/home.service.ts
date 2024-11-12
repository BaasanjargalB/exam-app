import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  baseUrl: String = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  getAllExam() {
    return this.http.get(`${this.baseUrl}exam/all`);
  }
}
