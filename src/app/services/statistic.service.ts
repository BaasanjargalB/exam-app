import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { from, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  private baseUrl: string = 'http://localhost:3000/';

  constructor(private http: HttpClient, private auth: Auth) {}

  getStatistic() {
    return from(user(this.auth)).pipe(
      mergeMap((currentUser) => {
        if (!currentUser?.uid) {
          throw new Error('User not authenticated');
        }
        return this.http.get(`${this.baseUrl}userExam/statistic/${currentUser.uid}`);
      })
    );
  }
}
