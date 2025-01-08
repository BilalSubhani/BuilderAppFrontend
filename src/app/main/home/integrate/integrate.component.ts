import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MainService } from '../../main.service';

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
  private subscription?: Subscription;

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    private mainService: MainService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  dataController(){
    this.http.get<any>('http://localhost:3000/data/component/integrate').subscribe(
      (res)=>{
        this.integrateData=res.data;
      },
      (err)=>{
        console.log(err);
      });
  }

  ngOnInit(){
    this.dataController();

    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataController();
      }
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
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
