import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseUrl: string = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  getPendingRequests() {
    return this.http.get(`${this.baseUrl}user/status/pending`);
  }

  approveUser(userId: any) {
    return this.http.put(`${this.baseUrl}user/approve/${userId}`, {});
  }

  deleteUser(userId: string) {
    return this.http.delete<{ message: string; fireId: string }>(`${this.baseUrl}user/${userId}`, {});
  }
}
