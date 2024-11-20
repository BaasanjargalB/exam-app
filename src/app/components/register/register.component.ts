import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { from } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private msg: MessageService,
  ) {

  }

  onRegister() {
    if (this.password === this.confirmPassword) {
      from(this.authenticationService.createUser({
        email: this.email,
        password: this.password,
      })).subscribe(
        (res) => {
          console.log(res);
          console.log("-------");
          this.msg.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай бүртгүүллээ.',
          });
          this.router.navigate(['home']);
        }
      );
    }
  }
}
