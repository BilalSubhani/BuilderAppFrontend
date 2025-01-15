import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './main/home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserListComponent } from './userlogin/userlogin.component';
import { AuthGuard } from './guards/auth.guard';
import { MainComponent } from './main/main.component';
import { ImageComponent } from './main/image/image.component';
import { VideoComponent } from './main/video/video.component';
import { TextComponent } from './main/text/text.component';

export const routes: Routes = [
    { path: 'login', component: UserListComponent},
    { path: 'dashboard', component: MainComponent, canActivate: [AuthGuard]},
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'burq', component: HomeComponent },
    { path: 'dashboard/users', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'dashboard/uploadimage', component: ImageComponent, canActivate: [AuthGuard] },
    { path: 'dashboard/uploadvideo', component: VideoComponent, canActivate: [AuthGuard] },
    { path: 'dashboard/changetext', component: TextComponent, canActivate: [AuthGuard] },
    { path: '**', component: PageNotFoundComponent},
];