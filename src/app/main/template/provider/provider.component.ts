import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, Inject, PLATFORM_ID, Output, EventEmitter} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MainService } from '../../main.service';
import { VideoComponent } from '../../video/video.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.less'],
  imports: [CommonModule, VideoComponent, FormsModule]
})
export class ProviderTemplateComponent implements AfterViewInit {

  @ViewChild('counterSection', { static: false }) counterSection!: ElementRef;
  @ViewChild('counterCities', { static: false }) counterCities!: ElementRef;
  @ViewChild('bottomItem1', { static: false }) bottomItem1!: ElementRef;
  @ViewChild('bottomItem2', { static: false }) bottomItem2!: ElementRef;
  @ViewChild('bottomItem3', { static: false }) bottomItem3!: ElementRef;

  @Output() providerEvent: EventEmitter<any> = new EventEmitter<any> ();

  private subscription?: Subscription;
  videoPID: string = 'provider';
  providerImageUrl: string[] = [];
  imagePublicId: string[] = ['lines', 'tick', 'counter1', 'counter2', 'counter3'];

  providersData: any;
  private intervalId: any;
  private counterValue = 300;
  private updatedCounter: number = 300;
  objectKeys  = Object.keys;

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    private toastr: ToastrService,
    private mainService: MainService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  dataFunction(){
    this.imagePublicId.forEach( pid =>  {
      this.http.get<any>(`http://localhost:3000/media/images/${pid}`).subscribe(
        (response: any) => {
          this.providerImageUrl.push(response.url);
        },
        (error) => {
          this.toastr.error('Error fetching video', 'Error', {
            positionClass: 'toast-top-right',
            progressBar: true,
            progressAnimation: 'decreasing'
          });
        }
      );
    });

    this.http.get<any>('http://localhost:3000/data/component/providers').subscribe(
      (res: any)=>{
        this.providersData= {...this.providersData, ...res.data};
      }, (err) =>{
        console.log(err);
      }
    );
  }

  ngOnInit(){
    this.dataFunction();
    this.setExport();
    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataFunction();
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if ('IntersectionObserver' in window) {

        const observerFeatures = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            //console.log(entry);
            const action = entry.isIntersecting ? 'addClass' : 'removeClass';
            this.renderer[action](this.bottomItem1.nativeElement, 'show');
            this.renderer[action](this.bottomItem2.nativeElement, 'show');
            this.renderer[action](this.bottomItem3.nativeElement, 'show');

            if (entry.isIntersecting) {
              // const counterComplete = this.counterValue === 300 ? false: localStorage.getItem('counterComplete');
              const counterComplete = this.updatedCounter === 3000 ? true : false;
              // console.log(counterComplete);
              if (!counterComplete) {
                clearInterval(this.intervalId);
                this.counterValue = 300;
                this.updateCounter();

                this.intervalId = setInterval(() => {
                  this.counterValue += 30;
                  this.updateCounter();

                  if (this.counterValue >= 3000) {
                    this.updatedCounter = this.counterValue;
                    clearInterval(this.intervalId);
                    // localStorage.setItem('counterComplete', 'true');
                  }
                }, 20);
              } else {
                this.counterValue = this.updatedCounter;
                this.updateCounter();
              }
            }
          }, { threshold: 0.8 });
        });

        observerFeatures.observe(this.counterSection.nativeElement);
      } else {
        console.warn('IntersectionObserver is not supported in this environment.');
      }
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private updateCounter(): void {
    if (this.counterCities) {
      this.renderer.setProperty(this.counterCities.nativeElement, 'textContent', this.counterValue);
    }
  }

  // editable Fields
  // --------------------------------------------------------------

  editingField: string | null = null;
  updatedTitle: string | null = null;
  updatedBody: string | null = null;
  updatedList: { [key: string]: string } = {};

  startEditing(field: string, key?: string) {
    this.editingField = key ? `${field}-${key}` : field;

    if (field === 'title') {
      this.updatedTitle = this.providersData?.title;
    } else if (field === 'body') {
      this.updatedBody = this.providersData?.body;
    } else if (field === 'list' && key) {
      this.updatedList[key] = this.providersData?.listItems[key];
    }
  }

  saveField() {
    if (this.editingField) {
      if (this.editingField === 'title') {
        this.providersData.title = this.updatedTitle!;
      } else if (this.editingField === 'body') {
        this.providersData.body = this.updatedBody!;
      } else if (this.editingField.startsWith('list')) {
        const key = this.editingField.split('-')[1];
        this.providersData.listItems[key] = this.updatedList[key];
      }
    }

    this.editingField = null;
    this.updatedTitle = null;
    this.updatedBody = null;
    this.updatedList = {};
    //console.log('Updated Providers Data:', this.providersData);

    this.setExport();
  }

  cancelEditing() {
    if (this.editingField) {
      if (this.editingField === 'title') {
        this.updatedTitle = this.providersData.title;
      } else if (this.editingField === 'body') {
        this.updatedBody = this.providersData.body;
      } else if (this.editingField.startsWith('list')) {
        const key = this.editingField.split('-')[1];
        this.updatedList[key] = this.providersData.listItems[key];
      }
    }

    this.editingField = null;
    this.updatedTitle = null;
    this.updatedBody = null;
    this.updatedList = {};
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cancelEditing();
    } else if (event.key === 'Enter') {
      this.saveField();
    }
  }


  //---------------------------------------------------------------

  setExport(){
    this.providerEvent.emit(this.providersData);
  }
}
