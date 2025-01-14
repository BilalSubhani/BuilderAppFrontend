import { Component, ElementRef, Renderer2, ViewChild, Inject, PLATFORM_ID, ViewChildren, QueryList } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-template-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.less'
})
export class FooterTemplateComponent {
  @ViewChild('footerContainer', {static: false}) footerContainer!: ElementRef;
  @ViewChild('footerLogo', {static: false}) footerLogo!: ElementRef;
  @ViewChildren('footerSection') footerSection!: QueryList<ElementRef<HTMLDivElement>>;
  imageUrl: string = '';
  
  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}

  ngOnInit(){
    this.http.get<any>(`http://localhost:3000/media/images/footerLogo`).subscribe(
      (response: any) => {
        this.imageUrl = response.url;
      },
      (error) => {
        console.log(error);
      }
    );

  }

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
          })
        }, { threshold: 0.3 });

        observerContainer.observe(this.footerContainer.nativeElement); 
      }
    }
  }
}