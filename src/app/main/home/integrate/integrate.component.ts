import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, Inject, PLATFORM_ID, Input } from '@angular/core';
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

  @Input() message: string = '';

  integrateData: any;
  imageUrl: string = '';
  private subscription?: Subscription;

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    private mainService: MainService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  dataController(){
    this.http.get<any>(`http://localhost:3000/media/images/lines`).subscribe(
      (response: any) => {
        this.imageUrl = response.url;
      },
      (error) => {
        console.log(error);
      }
    );
    
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

  ngOnChannges(){
    if(this.message === 'integrate'){
      // console.log(`${this.message}`);
      this.dataController();
    }
    window.location.reload();
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
