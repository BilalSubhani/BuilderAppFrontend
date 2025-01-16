import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { io } from 'socket.io-client';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.onload = () => {
        this.connectToSocket();
      };
    }
  }

  private socket: any;

  connectToSocket(): void {
    this.socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      //console.log('Connected to server with ID:', this.socket.id);
    });

    this.socket.on('handleChange', (data: any) => {
      this.implementation();
    });

    this.socket.on('connect_error', (err: any) => {
      console.error('Connection error:', err);
    });
  }
  
  implementation(){
    window.location.reload();
  }
}