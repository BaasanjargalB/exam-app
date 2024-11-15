import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  constructor(private router: Router, private auth: AuthenticationService) {}

  onLogout() {
    this.auth.logOut().subscribe({
      next: () => this.router.navigate(['login']),
    });
  }
}
