import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MainService } from '../../main.service';

@Component({
  selector: 'app-whyburq',
  imports: [CommonModule],
  templateUrl: './whyburq.component.html',
  styleUrl: './whyburq.component.less'
})

export class WhyburqComponent {
  @ViewChild('whyburqContainer', { static: false }) whyburqContainer!: ElementRef;
  @ViewChild('whyburqLeftDiv', { static: false }) whyburqLeftDiv!: ElementRef;
  @ViewChild('whyburqRightDiv', { static: false }) whyburqRightDiv!: ElementRef;
  @ViewChild('benefitsContainer', {static: false}) benefitsContainer!: ElementRef;

  whyBurqData: any;
  benefitsData: any;
  imagePublicUrl: string[] = ['whyburq', 'sp1', 'sp2', 'sp3']
  imageUrl: string[] = [];
  private subscription?: Subscription;

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    private mainService: MainService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  dataFunctions(): void{
    this.imagePublicUrl.forEach((p_id)=>{
      this.http.get<any>(`http://localhost:3000/media/images/${p_id}`).subscribe(
        (response: any) => {
          this.imageUrl.push(response.url);
        },
        (error) => {
          console.log(error);
        }
      );
    });

    this.http.get<any>("http://localhost:3000/data/component/whyBurq").subscribe((res)=>{
      this.whyBurqData = res.data;
    }, (err)=>{
      console.log(err);
    });

    this.http.get<any>("http://localhost:3000/data/component/sellingPoints").subscribe((res)=>{
      this.benefitsData = res.data;
    }, (err)=>{
      console.log(err);
    });
  }


  ngOnInit(){
    this.dataFunctions();

    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataFunctions();
      }
    });
  }

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

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}