import { Component, ElementRef, ViewChild, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { VideoComponent } from '../../video/video.component';
import { FormsModule } from '@angular/forms';
import { ImageComponent } from '../../image/image.component';

@Component({
  selector: 'app-template-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.less'],
  imports: [CommonModule, VideoComponent, FormsModule, ImageComponent]
})
export class ProviderTemplateComponent {

  @ViewChild('counterSection', { static: false }) counterSection!: ElementRef;
  @ViewChild('counterCities', { static: false }) counterCities!: ElementRef;
  @ViewChild('bottomItem1', { static: false }) bottomItem1!: ElementRef;
  @ViewChild('bottomItem2', { static: false }) bottomItem2!: ElementRef;
  @ViewChild('bottomItem3', { static: false }) bottomItem3!: ElementRef;

  @Output() providerEvent: EventEmitter<any> = new EventEmitter<any> ();

  videoPID: string = 'provider';
  providerImageUrl: string[] = [];
  imagePublicId: string[] = ['lines', 'tick', 'counter1', 'counter2', 'counter3'];

  providersData: any;
  firstCounterCount1: string[] = [];
  secondCounterCount2: string[] = [];
  thirdCounterCount3: string[] = [];

  counter1Head!: string;
  counter1Body!: string;
  counter2Head!: string; 
  counter2Body!: string;
  counter3Head!: string;
  counter3Body!: string;

  objectKeys  = Object.keys;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  imageController() {
    this.imagePublicId.forEach(pid =>  {
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
  }

  dataFunction(): Observable<void> {
    return new Observable((observer) => {
      this.http.get<any>('http://localhost:3000/data/component/providers').subscribe(
        (res: any) => {
          this.providersData = { ...this.providersData, ...res.data };

          if (this.providersData?.counterItems?.[0]?.Count1) {
            this.firstCounterCount1 = [...this.providersData?.counterItems[0]?.Count1];
            this.counter1Head = this.firstCounterCount1[0];
            this.counter1Body = this.firstCounterCount1[1];
          }
          if (this.providersData?.counterItems?.[1]?.Count2) {
            this.secondCounterCount2 = [...this.providersData?.counterItems[1]?.Count2];
            this.counter2Head = this.secondCounterCount2[0]; 
            this.counter2Body = this.secondCounterCount2[1];
          }
          if (this.providersData?.counterItems?.[2]?.Count3) {
            this.thirdCounterCount3 = [...this.providersData?.counterItems[2]?.Count3];
            this.counter3Head = this.thirdCounterCount3[0];
            this.counter3Body = this.thirdCounterCount3[1];
          }

          observer.next();
          observer.complete();
        },
        (err) => {
          console.log('Error fetching providers data:', err);
          observer.error(err);
        }
      );
    });
  }

  ngOnInit() {
    this.imageController();

    this.dataFunction().subscribe({
      next: () => {
        this.setExport();
      },
      error: (err) => {
        console.log('Error in dataFunction:', err);
      }
    });
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

  // Counter Section
  //---------------------------------------------------------------
  

  counter1HeadChange: boolean = false;
  counter1BodyChange: boolean = false;
  counter2HeadChange: boolean = false;
  counter2BodyChange: boolean = false;
  counter3HeadChange: boolean = false;
  counter3BodyChange: boolean = false;

  makeEditable(index: number){
    if (index === 1) {
      this.counter1HeadChange = !this.counter1HeadChange;
      this.counter1BodyChange = !this.counter1BodyChange;
    } else if (index === 2) {
      this.counter2HeadChange = !this.counter2HeadChange;
      this.counter2BodyChange = !this.counter2BodyChange;
    } else if (index === 3) {
      this.counter3HeadChange = !this.counter3HeadChange;
      this.counter3BodyChange = !this.counter3BodyChange;
    }
  }

  saveCounterField(index: number){
    if (index === 1) {
      this.providersData.counterItems[0].Count1 = [this.counter1Head, this.counter1Body];
    } else if (index === 2) {
      this.providersData.counterItems[1].Count2 = [this.counter2Head, this.counter2Body];
    } else if (index === 3) {
      this.providersData.counterItems[2].Count3 = [this.counter3Head, this.counter3Body];
    }

    this.makeEditable(index);
    this.setExport();
  }

  cancelEditingCounter(index: number){
    if (index === 1) {
      this.counter1Head = this.firstCounterCount1[0];
      this.counter1Body = this.firstCounterCount1[1];
    } else if (index === 2) {
      this.counter2Head = this.secondCounterCount2[0];
      this.counter2Body = this.secondCounterCount2[1];
    } else if (index === 3) {
      this.counter3Head = this.thirdCounterCount3[0];
      this.counter3Body = this.thirdCounterCount3[1];
    }

    this.makeEditable(index);
  }

  handleCounterKeyUp(event: KeyboardEvent, index: number) {
    if (event.key === 'Escape') {
      this.cancelEditingCounter(index);
    } else if (event.key === 'Enter') {
      this.saveCounterField(index);
    }
  }
  
  //---------------------------------------------------------------

  setExport() {
    this.providerEvent.emit(this.providersData);
  }

  publicID: string = '';
  change: boolean = false;

  changeLogo(index: any) {
    if (typeof index !== 'string') {
      this.publicID = this.imagePublicId[index];
      this.change = !this.change;
    } else {
      this.change = !this.change;
    }
  }
}
