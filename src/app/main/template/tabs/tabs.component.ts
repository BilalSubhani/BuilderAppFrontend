import { Component, AfterViewInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { MainService } from '../../main.service';
import { ImageComponent } from '../../image/image.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.less'],
  imports:[CommonModule, ImageComponent, FormsModule]
})
export class TabsTemplateComponent implements AfterViewInit {

  @Output() tabsEvent = new EventEmitter<any>();
  @Input() fieldToUpdate!: string;

  publicID=["tabContent1", "tabContent2", "tabContent3"];
  p_ID:string = 'tabContent1';

  private subscription?: Subscription;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private mainService: MainService,
    private http : HttpClient
  ) {}

  imagePublicUrl: string[] = ['tab1', 'tab2', 'tab3', 'tabContent1', 'tabContent2', 'tabContent3'];
  tabsImageUrl: string[] = [];
  tabData: any;

  imageController(){
    this.imagePublicUrl.forEach((p_id)=>{
      this.http.get<any>(`http://localhost:3000/media/images/${p_id}`).subscribe(
        (response: any) => {
          this.tabsImageUrl.push(response.url);
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  dataFunction(): Observable<void> {
    return new Observable((observer) => {
      this.http.get<any>('http://localhost:3000/data/component/tabs').subscribe(
        (res: any) => {
          this.tabData = res.data;
  
          observer.next();
          observer.complete();
        },
        (err) => {
          console.log('Error fetching tab data:', err);
          observer.error(err);
        }
      );
    });
  }

  ngOnInit(){
    this.imageController();

    this.dataFunction().subscribe({
      next: () => {
        this.setExport();
      },
      error: (err) => {
        console.log('Error in dataFunction:', err);
      }
    });

    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataFunction();
      }
    });
  }

  ngOnChanges(){
    if(this.fieldToUpdate === 'tabContent1' || this.fieldToUpdate === 'tabContent2' || this.fieldToUpdate === 'tabContent3' ||
      this.fieldToUpdate === 'tab1' || this.fieldToUpdate === 'tab2' || this.fieldToUpdate === 'tab3'
    ){
      this.p_ID = this.fieldToUpdate;
    }
    else if(this.fieldToUpdate === '0' || this.fieldToUpdate === '1' || this.fieldToUpdate === '2'){
      this.enableTabEdit(parseInt(this.fieldToUpdate));
    }
  }

  ngAfterViewInit(): void {
    const tabs = Array.from(this.document.querySelectorAll('.tab')) as HTMLElement[];
    const images = Array.from(this.document.querySelectorAll('.content img')) as HTMLElement[];
    const icons = Array.from(this.document.querySelectorAll('.icon')) as HTMLElement[];

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        images.forEach(img => img.classList.remove('active'));
        icons.forEach(icon => icon.classList.remove('active'));

        tab.classList.add('active');

        const tabId = tab.getAttribute('data-tab');
        if (tabId) {
          const imageToActivate = this.document.querySelector(`.content img[data-tab="${tabId}"]`);
          const iconToActivate = this.document.querySelector(`.icon[data-tab="${tabId}"]`);

          if (imageToActivate) {
            imageToActivate.classList.add('active');
          }

          if (iconToActivate) {
            iconToActivate.classList.add('active');
          }
        }
      });
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }


  isEditingTab: { [key: number]: boolean } = {};
  editedTab: { [key: number]: string } = {};

  enableTabEdit(index: number) {
    this.isEditingTab[index] = true;
    this.editedTab[index] = this.tabData[index];
  }

  saveTabEdit(index: number) {
    this.tabData[index] = this.editedTab[index];
    this.isEditingTab[index] = false;
  }

  cancelTabEdit(index: number) {
    this.isEditingTab[index] = false;
  }

  setExport(){
    this.tabsEvent.emit(this.tabData);
  }
}
