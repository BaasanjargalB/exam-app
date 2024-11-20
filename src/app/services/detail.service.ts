import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { from, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DetailService {
  baseUrl: String = 'http://localhost:3000/';

  constructor(private http: HttpClient, private auth: Auth, ) {}

  getExamById(id: String) {
    return from(user(this.auth)).pipe(
      mergeMap((currentUser) => {
        if (!currentUser?.uid) {
          throw new Error('User not authenticated');
        }
        const fireId = currentUser.uid;
        return this.http.get(`${this.baseUrl}exam/${id}/${fireId}`);
      })
    ); 
  }

  saveExamAttempt(id: String, body: any) {
    return this.http.post(`${this.baseUrl}userExam/attempt/${id}`, body);
  }
}
