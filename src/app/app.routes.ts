import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './main/home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserListComponent } from './userlogin/userlogin.component';
import { AuthGuard } from './guards/auth.guard';
import { MainComponent } from './main/main.component';
import { ImageComponent } from './main/image/image.component';
import { VideoComponent } from './main/video/video.component';
import { TextComponent } from './main/text/text.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
    { path: 'login', component: UserListComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'burq', component: HomeComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
    { path: 'admin/users', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'customization', component: MainComponent, canActivate: [AuthGuard]},
    { path: 'customization/uploadimage', component: ImageComponent, canActivate: [AuthGuard] },
    { path: 'customization/uploadvideo', component: VideoComponent, canActivate: [AuthGuard] },
    { path: 'customization/changetext', component: TextComponent, canActivate: [AuthGuard] },
    { path: '**', component: PageNotFoundComponent},
];