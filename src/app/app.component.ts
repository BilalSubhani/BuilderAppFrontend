import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('navbar', { static: false}) navbar!: ElementRef;
  @ViewChild('featuresHeading', { static: false }) cards!: ElementRef;
  @ViewChild('featuresContainer', { static: false }) featureSection!: ElementRef;
  @ViewChild('feature1Card', { static: false }) feature1!: ElementRef;
  @ViewChild('feature2Card', { static: false }) feature2!: ElementRef;
  @ViewChild('feature3Card', { static: false }) feature3!: ElementRef;

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
            this.renderer[action](this.navbar.nativeElement, 'shrink');
          });
        }, { threshold: 0.1 });

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

        observerNavbar.observe(this.featureSection.nativeElement);
        observerCards.observe(this.featureSection.nativeElement);
        observerFeatures.observe(this.featureSection.nativeElement);
      } else {
        console.warn('IntersectionObserver is not supported in this environment.');
      }
    }
  }
}
