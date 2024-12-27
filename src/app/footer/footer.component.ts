import { Component, ElementRef, Renderer2, ViewChild, Inject, PLATFORM_ID, ViewChildren, QueryList } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.less'
})
export class FooterComponent {
  @ViewChild('footerContainer', {static: false}) footerContainer!: ElementRef;
  @ViewChild('footerLogo', {static: false}) footerLogo!: ElementRef;
  @ViewChildren('footerSection') footerSection!: QueryList<ElementRef<HTMLDivElement>>;
  // @ViewChild('footerSection1', { static: false}) footerSection1!: ElementRef;
  // @ViewChild('footerSection2', { static: false}) footerSection2!: ElementRef;
  // @ViewChild('footerSection3', { static: false}) footerSection3!: ElementRef;
  // @ViewChild('footerSection4', { static: false}) footerSection4!: ElementRef;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}

  ngAfterViewInit(): void{
    if(isPlatformBrowser(this.platformId)){
      if('IntersectionObserver' in window){
        const observerContainer = new IntersectionObserver((entries) =>{
          entries.forEach((entry) =>{
            const action = entry.isIntersecting ? 'addClass' : 'removeClass';
            this.renderer[action](this.footerLogo.nativeElement, 'show');

            this.footerSection.forEach((section)=>{
              this.renderer[action](section.nativeElement, 'show');
            });

            // this.renderer[action](this.footerSection1.nativeElement, 'show');
            // this.renderer[action](this.footerSection2.nativeElement, 'show');
            // this.renderer[action](this.footerSection3.nativeElement, 'show');
            // this.renderer[action](this.footerSection4.nativeElement, 'show');
          })
        }, { threshold: 0.3 });

        observerContainer.observe(this.footerContainer.nativeElement);
        // this.footerSection.forEach((section)=>{
        //   console.log('Footer Section', section);
        // })
        
      }
    }
  }
}