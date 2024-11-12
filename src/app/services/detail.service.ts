import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DetailService {
  baseUrl: String = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  getExamById(id: String) {
    return this.http.get(`${this.baseUrl}exam/${id}`);
  }
}
