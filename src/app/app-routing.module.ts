import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DetailComponent } from './components/detail/detail.component';
import { homeResolver } from './resolvers/home.resolver';
import { detailResolver } from './resolvers/detail.resolver';
import { authGuard } from './guards/auth.guard';
import { leaveExamGuard } from './guards/leave-exam.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, resolve: { exams: homeResolver } },
  {
    path: 'details',
    component: DetailComponent,
    resolve: { exam: detailResolver },
    canDeactivate: [leaveExamGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
