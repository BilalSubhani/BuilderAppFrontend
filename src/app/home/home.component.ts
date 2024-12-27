import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Components
import { ProviderComponent } from './provider/provider.component';
import { TabsComponent } from './tabs/tabs.component';
import { IntegrateComponent } from './integrate/integrate.component';
import { IndustriesComponent } from './industries/industries.component';
import { WhyburqComponent } from './whyburq/whyburq.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { FooterComponent } from '../footer/footer.component';
import { BackingComponent } from './backing/backing.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProviderComponent, TabsComponent, IntegrateComponent, IndustriesComponent, WhyburqComponent, TestimonialsComponent, FooterComponent, BackingComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('navbar', { static: false }) navbar!: ElementRef;
  @ViewChild('featuresHeading', { static: false }) cards!: ElementRef;
  @ViewChild('heroSection', { static: false }) heroSection!: ElementRef;
  @ViewChild('featuresContainer', { static: false }) featureSection!: ElementRef;
  @ViewChild('feature1Card', { static: false }) feature1!: ElementRef;
  @ViewChild('feature2Card', { static: false }) feature2!: ElementRef;
  @ViewChild('feature3Card', { static: false }) feature3!: ElementRef;
  @ViewChild('myBtn', { static: false }) myBtn!: ElementRef;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if ('IntersectionObserver' in window) {
        const observerNavbar = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const action = entry.isIntersecting ? 'addClass' : 'removeClass';
            this.renderer[action](this.navbar.nativeElement, 'expand');
            
            const scrolled = entry.isIntersecting ? 'None' : 'Block';
            this.renderer.setStyle(this.myBtn.nativeElement, 'display', scrolled);
          });
        }, { threshold: 0.7 });

        const observerCards = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const action = entry.isIntersecting ? 'addClass' : 'removeClass';
            this.renderer[action](this.cards.nativeElement, 'show');
          });
        }, { threshold: 0.2 });

        const observerFeatures = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const action = entry.isIntersecting ? 'addClass' : 'removeClass';
            this.renderer[action](this.feature1.nativeElement, 'show');
            this.renderer[action](this.feature2.nativeElement, 'show');
            this.renderer[action](this.feature3.nativeElement, 'show');
          });
        }, { threshold: 0.5 });

        observerNavbar.observe(this.heroSection.nativeElement);
        observerCards.observe(this.featureSection.nativeElement);
        observerFeatures.observe(this.featureSection.nativeElement);
      } else {
        console.warn('IntersectionObserver is not supported in this environment.');
      }
    }
  }

  topFunction(): void {
    const scrollStep = -window.scrollY / (2000 / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

  
}
