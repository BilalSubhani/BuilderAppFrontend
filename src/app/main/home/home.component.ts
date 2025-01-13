import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { ProviderComponent } from './provider/provider.component';
import { TabsComponent } from './tabs/tabs.component';
import { IntegrateComponent } from './integrate/integrate.component';
import { IndustriesComponent } from './industries/industries.component';
import { WhyburqComponent } from './whyburq/whyburq.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { FooterComponent } from './footer/footer.component';
import { BackingComponent } from './backing/backing.component';
import { FeaturesComponent } from './features/features.component';
import { HerosectionComponent } from './herosection/herosection.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProviderComponent, 
    HerosectionComponent, TabsComponent, 
    IntegrateComponent, IndustriesComponent,
    WhyburqComponent, TestimonialsComponent, 
    FooterComponent, BackingComponent, 
    CommonModule, FeaturesComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})

export class HomeComponent {

}