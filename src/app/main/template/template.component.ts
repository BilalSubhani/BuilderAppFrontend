import { Component, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
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
export class TemplateComponent implements AfterViewInit{

  @Output() templateEvent = new EventEmitter<any>();
  exportData: any;

  @Input() field!: string;

  navbar:         any;
  hero:           any;
  features:       any;
  providers:      any;
  tabs:           any;
  integrate:      any;
  industries:     any;
  whyburq:        any;
  sellingPoints:  any;
  test:           any;
  backing:        any;
  startPowering:  any;
  footerData:     any;

  receiveHero(event: any) {
    this.navbar = event?.navbar;
    this.hero = event?.heroSection;

    this.setExportData();
  }
  receiveFeature(event: any){
    this.features=event;
    
    this.setExportData();
  }
  receiveProviders(event: any){
    this.providers = event;
    
    this.setExportData();
  }
  receiveIntegrate(event: any){
    this.integrate = event;
    
    this.setExportData();
  }
  receiveWhyBurq(event: any){
    this.whyburq = event?.whyBurq;
    this.sellingPoints = event?.sellingPoints;
    
    this.setExportData();
  }
  receiveBacking(event: any){
    this.backing = event?.backing;
    this.startPowering = event?.startPowering;
    
    this.setExportData();
  }
  receiveIndustries(event: any){
    this.industries = event;
    
    this.setExportData();
  }
  receiveTabs(event: any){
    this.tabs = event;
    
    this.setExportData();
  }
  receiveTest(event: any){
    this.test = event;
    
    this.setExportData();
  }
  receiveFooter(event: any){
    this.footerData = event;
    
    this.setExportData();
  }

  ngAfterViewInit(): void {
    this.setExportData();
  }

  setExportData(){
    this.exportData = {
      "navbar" : this.navbar,
      "heroSection" : this.hero,
      "features": this.features,
      "providers": this.providers,
      "tabs" : this.tabs,
      "integrate": this.integrate,
      "industries": this.industries,
      "whyBurq": this.whyburq,
      "sellingPoints": this.sellingPoints,
      "testimonials": this.test,
      "backing": this.backing,
      "startPowering": this.startPowering,
      "footer": this.footerData
    }

    this.templateEvent.emit(this.exportData);
  }
}