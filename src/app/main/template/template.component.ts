import { Component } from '@angular/core';
import { ProviderTemplateComponent } from './provider/provider.component';
import { HerosectionTemplateComponent } from './herosection/herosection.component';
import { TabsTemplateComponent } from './tabs/tabs.component';
import { IntegrateTemplateComponent } from './integrate/integrate.component';
import { IndustriesTemplateComponent } from './industries/industries.component';
import { FeaturesTemplateComponent } from './features/features.component';
import { BackingTemplateComponent } from './backing/backing.component';
import { FooterTemplateComponent } from './footer/footer.component';
import { WhyburqTemplateComponent } from './whyburq/whyburq.component';
import { TestimonialsTemplateComponent } from './testimonials/testimonials.component';


@Component({
  selector: 'app-template',
  standalone: true,
  imports: [
    ProviderTemplateComponent, FeaturesTemplateComponent,
    HerosectionTemplateComponent, TabsTemplateComponent, 
    IntegrateTemplateComponent, IndustriesTemplateComponent,
    WhyburqTemplateComponent, TestimonialsTemplateComponent, 
    FooterTemplateComponent, BackingTemplateComponent,
  ],
  templateUrl: './template.component.html',
  styleUrl: './template.component.less'
})
export class TemplateComponent {

}