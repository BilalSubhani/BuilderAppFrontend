import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserListComponent } from './userlogin/userlogin.component';
import { AuthGuard } from './guards/auth.guard';
import { MainComponent } from './main/main.component';
import { BackingComponent } from './home/backing/backing.component';
import { IndustriesComponent } from './home/industries/industries.component';
import { IntegrateComponent } from './home/integrate/integrate.component';
import { ProviderComponent } from './home/provider/provider.component';
import { TabsComponent } from './home/tabs/tabs.component';
import { TestimonialsComponent } from './home/testimonials/testimonials.component';
import { WhyburqComponent } from './home/whyburq/whyburq.component';

export const routes: Routes = [
    { path: 'login', component: UserListComponent},
    { path: 'main', component: MainComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'burq', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'admin-dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    // Main page routes
    { 
        path: 'main', 
        component: MainComponent,
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'backing', component: BackingComponent },
            { path: 'industries', component: IndustriesComponent },
            { path: 'integrate', component: IntegrateComponent },
            { path: 'provider', component: ProviderComponent },
            { path: 'tabs', component: TabsComponent },
            { path: 'testimonials', component: TestimonialsComponent },
            { path: 'whyburq', component: WhyburqComponent },
        ],
    },
    { path: '**', component: PageNotFoundComponent},
];