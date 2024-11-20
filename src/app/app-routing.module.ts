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
import { adminGuard } from './guards/admin.guard';
import { ExamCreateComponent } from './components/exam-create/exam-create.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import { statisticResolver } from './resolvers/statistic.resolver';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent, resolve: { exams: homeResolver } },
  {
    path: 'details',
    component: DetailComponent,
    resolve: { exam: detailResolver },
    canDeactivate: [leaveExamGuard],
  },
  { path: 'exam', component: ExamCreateComponent, canActivate: [adminGuard] },
  { path: 'statistic', component: StatisticComponent, resolve: { statistic: statisticResolver } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
