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
    { path: 'main', component: MainComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'burq', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'admin-dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'main', component: MainComponent },
    { path: 'main/uploadimage', component: ImageComponent },
    { path: 'main/uploadvideo', component: VideoComponent },
    { path: 'main/changetext', component: TextComponent },
    { path: '**', component: PageNotFoundComponent},
];