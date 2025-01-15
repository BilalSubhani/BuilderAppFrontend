import { Component, AfterViewInit, Inject, Output, EventEmitter } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MainService } from '../../main.service';

@Component({
  selector: 'app-template-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.less'],
  imports:[CommonModule]
})
export class TabsTemplateComponent implements AfterViewInit {

  @Output() tabsEvent = new EventEmitter<any>();

  private subscription?: Subscription;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private mainService: MainService,
    private http : HttpClient
  ) {}

  imagePublicUrl: string[] = ['tab1', 'tab2', 'tab3', 'tabContent1', 'tabContent2', 'tabContent3'];
  tabsImageUrl: string[] = [];
  tabData: any;

  dataFunction(){
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

    this.http.get<any>('http://localhost:3000/data/component/tabs').subscribe(
      (res: any)=>{
        this.tabData= res;
      }, (err) =>{
        console.log(err);
      }
    );
  }

  ngOnInit(){
    this.dataFunction();

    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataFunction();
      }
    });
  }

  ngAfterViewInit(): void {
    this.setExport();
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

  setExport(){
    this.tabsEvent.emit(this.tabData?.data);
  }
}
