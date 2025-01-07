import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-integrate',
  templateUrl: './integrate.component.html',
  styleUrls: ['./integrate.component.less'],
  imports:[CommonModule]
})
export class IntegrateComponent implements AfterViewInit {

  @ViewChild('observeContainer', { static: false }) observeContainer!: ElementRef;
  @ViewChild('leftDiv', { static: false }) leftDiv!: ElementRef;
  @ViewChild('rightDiv', { static: false }) rightDiv!: ElementRef;

  integrateData: any;

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(){
    this.http.get<any>('http://localhost:3000/data/component/integrate').subscribe(
      (res)=>{
        this.integrateData=res.data;
      },
      (err)=>{
        console.log(err);
      });
  }

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
