import { Component } from '@angular/core';
import { ProviderComponent } from './provider/provider.component';
import { HerosectionComponent } from './herosection/herosection.component';
import { TabsComponent } from './tabs/tabs.component';
import { IntegrateComponent } from './integrate/integrate.component';
import { IndustriesComponent } from './industries/industries.component';
import { FeaturesComponent } from './features/features.component';
import { BackingComponent } from './backing/backing.component';
import { FooterComponent } from './footer/footer.component';
import { WhyburqComponent } from './whyburq/whyburq.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';


@Component({
  selector: 'app-template',
  standalone: true,
  imports: [
    ProviderComponent, FeaturesComponent,
    HerosectionComponent, TabsComponent, 
    IntegrateComponent, IndustriesComponent,
    WhyburqComponent, TestimonialsComponent, 
    FooterComponent, BackingComponent,
  ],
  templateUrl: './template.component.html',
  styleUrl: './template.component.less'
})
export class TemplateComponent {

}