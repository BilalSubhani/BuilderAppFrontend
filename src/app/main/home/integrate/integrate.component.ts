import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-integrate',
  templateUrl: './integrate.component.html',
  styleUrls: ['./integrate.component.less']
})
export class IntegrateComponent implements AfterViewInit {

  @ViewChild('observeContainer', { static: false }) observeContainer!: ElementRef;
  @ViewChild('leftDiv', { static: false }) leftDiv!: ElementRef;
  @ViewChild('rightDiv', { static: false }) rightDiv!: ElementRef;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if ('IntersectionObserver' in window) {
        // console.log(this.platformId);
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const action = entry.isIntersecting ? 'addClass' : 'removeClass';
            this.renderer[action](this.leftDiv.nativeElement, 'show');
            this.renderer[action](this.rightDiv.nativeElement, 'show');
          });
        }, { threshold: 0.5 });

        if (this.observeContainer) {
          observer.observe(this.observeContainer.nativeElement);
        }
      } else {
        console.warn('IntersectionObserver is not supported in this environment.');
      }
    }
  }
}
