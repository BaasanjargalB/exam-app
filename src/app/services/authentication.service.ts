import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User,
} from '@angular/fire/auth';
import { MessageService } from 'primeng/api';
import { catchError, from, map, Observable, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  currentUser: User | null = null;
  userRole: string | null = null;

  constructor(
    private auth: Auth,
    private msg: MessageService,
    private http: HttpClient,
  ) { }

  createUser(params: SignIn): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, params.email, params.password)
    ).pipe(
      switchMap((userCredential) => {
        this.userRole = "student";
        localStorage.setItem('userRole', this.userRole);
        const fireId = userCredential.user.uid;

        // Send user data to the backend
        return this.http.post('http://localhost:3000/user/register', {
          username: params.email,
          role: 'student',
          fireId: fireId
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).pipe(
          catchError((error) => {
            this.userRole = null;
            localStorage.removeItem('userRole');
            userCredential.user.delete().catch((deleteError) => {
              console.error('Error deleting user from Firebase', deleteError);
            });

            this.msg.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to save user data in database. User registration was rolled back.',
            });

            return throwError(() => new Error('Backend operation failed. User deleted from Firebase.'));
          })
        );
      }),
      catchError((error: FirebaseError) =>
        throwError(() => {
          this.msg.add({
            severity: 'error',
            summary: 'Error',
            detail: this.translateFirebaseErrorMessage(error),
          });
          new Error(this.translateFirebaseErrorMessage(error))
        })
      )
    );
  }

  signIn(params: SignIn): Observable<any> {
    return from(
      signInWithEmailAndPassword(this.auth, params.email, params.password)
    ).pipe(
      switchMap((userCredential) => {
        const fireId = userCredential.user.uid;
  
        return this.http.get(`http://localhost:3000/user/role/${fireId}`).pipe(
          tap((response: any) => {
            this.userRole = response.role;
            if (this.userRole) {
              localStorage.setItem('userRole', this.userRole);
            }
          }),
          catchError((error) => {
            this.msg.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to retrieve user information from the backend.',
            });
            return throwError(() => new Error(error));
          })
        );
      }),
      catchError((error: FirebaseError) =>
        throwError(() => {
          this.msg.add({
            severity: 'error',
            summary: 'Error',
            detail: this.translateFirebaseErrorMessage(error),
          });
          new Error(this.translateFirebaseErrorMessage(error))
        })
      )
    );
  }

  logOut(): Observable<any> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.currentUser = null;
        this.userRole = null;
        localStorage.removeItem('userRole');
      }),
      catchError((error: FirebaseError) =>
        throwError(() => {
          this.msg.add({
            severity: 'error',
            summary: 'Error',
            detail: this.translateFirebaseErrorMessage(error),
          });
          new Error(this.translateFirebaseErrorMessage(error))
        })
      )
    );
  }

  authState(): Observable<any> {
    return from(this.auth.authStateReady()).pipe(
      catchError((error: FirebaseError) =>
        throwError(() => {
          this.msg.add({
            severity: 'error',
            summary: 'Error',
            detail: this.translateFirebaseErrorMessage(error),
          });
          new Error(this.translateFirebaseErrorMessage(error))
        })
      )
    );
  }

  recoverPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      catchError((error: FirebaseError) =>
        throwError(() => {
          this.msg.add({
            severity: 'error',
            summary: 'Error',
            detail: this.translateFirebaseErrorMessage(error),
          });
          new Error(this.translateFirebaseErrorMessage(error))
        })
      )
    );
  }

  private translateFirebaseErrorMessage({ code, message }: FirebaseError) {
    if (code === 'auth/invalid-credential') {
      return 'Email or password is incorrect'
    }
    if (code === 'auth/user-not-found') {
      return 'User not found.';
    }
    if (code === 'auth/wrong-password') {
      return 'User not found.';
    }
    return message;
  }

  isLoggedIn(): Observable<boolean> {
    return authState(this.auth).pipe(map((user) => !!user));
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }
}

type SignIn = {
  email: string;
  password: string;
};

type FirebaseError = {
  code: string;
  message: string;
};
