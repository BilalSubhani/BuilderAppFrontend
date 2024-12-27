import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-whyburq',
  imports: [],
  templateUrl: './whyburq.component.html',
  styleUrl: './whyburq.component.less'
})

export class WhyburqComponent {
  @ViewChild('whyburqContainer', { static: false }) whyburqContainer!: ElementRef;
  @ViewChild('whyburqLeftDiv', { static: false }) whyburqLeftDiv!: ElementRef;
  @ViewChild('whyburqRightDiv', { static: false }) whyburqRightDiv!: ElementRef;
  @ViewChild('benefitsContainer', {static: false}) benefitsContainer!: ElementRef;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit(): void {
      if(isPlatformBrowser(this.platformId)){
        if('IntersectionObserver' in window){
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              const action = entry.isIntersecting ? 'addClass' : 'removeClass';
              this.renderer[action](this.whyburqLeftDiv.nativeElement, 'show');
              this.renderer[action](this.whyburqRightDiv.nativeElement, 'show');
            });
          }, { threshold: 0.3 });

          const observerBenefits = new IntersectionObserver((entries) =>{
            entries.forEach((entry) => {
              const action = entry.isIntersecting ? 'addClass' : 'removeClass';
              this.renderer[action](this.benefitsContainer.nativeElement, 'show');
            });
          }, { threshold: 0.3  })

          if(this.whyburqContainer){
            observer.observe(this.whyburqContainer.nativeElement);
          }
          if(this.benefitsContainer){
            observerBenefits.observe(this.benefitsContainer.nativeElement);
          }
        } else {
          console.warn('IntersectionObserver is not supported in this environment.');
      }
    }
  }
}