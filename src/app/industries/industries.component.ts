import { Component, AfterViewInit, Inject, OnInit, ViewChild, ElementRef, Renderer2, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { platformBrowser } from '@angular/platform-browser';

@Component({
  selector: 'app-industries',
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.less'],
})
export class IndustriesComponent implements AfterViewInit, OnInit {
  tabImages = {
    10: { active: '/images/tabIcons/ecommerce-blue.svg', inactive: '/images/tabIcons/ecommerce.svg' },
    11: { active: '/images/tabIcons/food-blue.svg', inactive: '/images/tabIcons/food.svg' },
    12: { active: '/images/tabIcons/flower-shop-blue.svg', inactive: '/images/tabIcons/flower-shop.svg' },
    13: { active: '/images/tabIcons/pharmacy-blue.svg', inactive: '/images/tabIcons/pharmacy.svg' },
    14: { active: '/images/tabIcons/construction-blue.svg', inactive: '/images/tabIcons/construction.svg' },
    15: { active: '/images/tabIcons/grocery-blue.svg', inactive: '/images/tabIcons/grocery.svg' },
    16: { active: '/images/tabIcons/retailer-blue.svg', inactive: '/images/tabIcons/retailer.svg' }
  };
  @ViewChild('indContainer', {static: false}) indContainer!: ElementRef;
  @ViewChild('indHeading', {static: false}) indHeading!: ElementRef;
  @ViewChild('indTabContainer', {static: false}) indTabContainer!: ElementRef;
  @ViewChild('indTabContent', {static: false}) indTabContent!: ElementRef;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    const firstTab = this.document.querySelector('.ind-tab[data-tab="10"]');
    if (firstTab) {
      firstTab.classList.add('active');
    }

    const firstTabContent = this.document.querySelector('.ind-tabcontent[data-tab="10"]');
    if (firstTabContent) {
      firstTabContent.classList.add('active');
    }

    const firstTabIcon = this.document.querySelector('.ind-icon[data-tab="10"]') as HTMLImageElement;
    if (firstTabIcon) {
      firstTabIcon.src = this.tabImages[10].active;
      firstTabIcon.classList.add('active');
    }
  }

  ngAfterViewInit(): void {
    const tabs = Array.from(this.document.querySelectorAll('.ind-tab')) as HTMLElement[];
    const icons = Array.from(this.document.querySelectorAll('.ind-icon')) as HTMLImageElement[];
    const tabContents = Array.from(this.document.querySelectorAll('.ind-tabcontent')) as HTMLElement[];

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tabContents.forEach((content) => content.classList.remove('active'));
        icons.forEach((icon) => {
          const iconTabId = icon.getAttribute('data-tab');
          if (iconTabId) {
            const numericTabId = parseInt(iconTabId, 10) as keyof typeof this.tabImages;
            if (this.tabImages[numericTabId]) {
              icon.src = this.tabImages[numericTabId].inactive;
              icon.classList.remove('active');
            }
          }
        });

        const tabId = tab.getAttribute('data-tab');
        if (tabId) {
          const numericTabId = parseInt(tabId, 10) as keyof typeof this.tabImages;

          tab.classList.add('active');
          const activeContent = this.document.querySelector(`.ind-tabcontent[data-tab="${tabId}"]`);
          if (activeContent) {
            activeContent.classList.add('active');
          }

          const activeIcon = this.document.querySelector(`.ind-icon[data-tab="${tabId}"]`) as HTMLImageElement;
          if (activeIcon) {
            activeIcon.src = this.tabImages[numericTabId].active;
            activeIcon.classList.add('active');
          }
        }
      });
    });

      if(isPlatformBrowser(this.platformId)){
        if('IntersectionObserver' in window){
          const observerHeading = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              const action = entry.isIntersecting ? 'addClass' : 'removeClass';
              this.renderer[action](this.indHeading.nativeElement, 'show');
            });
          }, {
            threshold: 0.2
          });

          const observerTabContainer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              const action = entry.isIntersecting ? 'addClass' : 'removeClass';
              this.renderer[action](this.indTabContainer.nativeElement, 'show');
            });
          }, {
            threshold: 0.3
          });

          const observerTabContent = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              const action = entry.isIntersecting ? 'addClass' : 'removeClass';
              this.renderer[action](this.indTabContent.nativeElement, 'show');
            });
          }, {
            threshold: 0.5
          });

          if(this.indContainer){
            observerHeading.observe(this.indContainer.nativeElement);
            observerTabContainer.observe(this.indContainer.nativeElement);
            observerTabContent.observe(this.indContainer.nativeElement);
          }
        } else {
          console.warn('IntersectionObserver is not supported in this environment ');
      }
    }
  }
}