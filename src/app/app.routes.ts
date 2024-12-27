import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserListComponent } from './userlogin/userlogin.component';

export const routes: Routes = [
    {path: 'login', component: UserListComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'admin-dashboard', component: DashboardComponent}, 
    {path: '**', component: PageNotFoundComponent}
];