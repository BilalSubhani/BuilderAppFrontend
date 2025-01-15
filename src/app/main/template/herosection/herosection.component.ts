import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MainService } from '../../main.service';
import { Subscription } from 'rxjs';
import { VideoComponent } from '../../video/video.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-template-herosection',
  standalone: true,
  imports: [CommonModule, VideoComponent, FormsModule],
  templateUrl: './herosection.component.html',
  styleUrl: './herosection.component.less'
})
export class HerosectionTemplateComponent {

  messageReceived:string = '';

  imagePublicUrl: string[] = ['burq-logo'];
  imageUrl: string[] = [];
  public_id: string = '3steps';

  navbarData: any;
  heroSectionData: any;

  private subscription?: Subscription;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private mainService: MainService
  ){}

  dataController(){

    this.imagePublicUrl.forEach((p_id)=>{
      this.http.get<any>(`http://localhost:3000/media/images/${p_id}`).subscribe(
        (response: any) => {
          this.imageUrl.push(response.url);
        },
        (error) => {
          this.toastr.error('Error fetching video', 'Error', {
            positionClass: 'toast-top-right',
            progressBar: true,
            progressAnimation: 'decreasing'
          });
        }
      );
    })

    this.http.get<any>('http://localhost:3000/data/component/navbar').subscribe(
      (res: any)=>{
        this.navbarData={...this.navbarData, ...res.data};
      }, (err) =>{
        console.log(err);
      }
    );

    this.http.get<any>('http://localhost:3000/data/component/heroSection').subscribe(
      (res: any)=>{
        this.heroSectionData= {...this.heroSectionData, ...res.data};
      }, (err) =>{
        console.log(err);
      }
    );
    
    this.mainService.notifyDataChange(false);
  }

  ngOnInit() {
    this.dataController();

    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataController();
      }
    });
  }

  // Navbar Field 
  // ----------------------------------------------------

  editingKeyIndex = new Set<number>();
  editKeyValue = '';
  editingValueIndex = new Set<string>();
  editValue = '';
  editingField: string | null = null;
  editButton = '';
  editButtonUrl = '';

  enableEditKey(index: number) {
    this.editingKeyIndex.add(index);
    this.editKeyValue = this.navbarData.listItems[index].key;
  }

  saveKeyEdit(index: number) {
    this.navbarData.listItems[index].key = this.editKeyValue;
    this.editingKeyIndex.delete(index);
  }

  cancelKeyEdit() {
    this.editingKeyIndex.clear();
  }

  enableEditValue(listIndex: number, valueIndex: number) {
    const compositeIndex = `${listIndex}-${valueIndex}`;
    this.editingValueIndex.add(compositeIndex);
    this.editValue = this.navbarData.listItems[listIndex].values[valueIndex];
  }

  saveValueEdit(listIndex: number, valueIndex: number) {
    this.navbarData.listItems[listIndex].values[valueIndex] = this.editValue;
    this.editingValueIndex.delete(`${listIndex}-${valueIndex}`);
  }

  cancelValueEdit() {
    this.editingValueIndex.clear();
  }

  startEditing(field: string) {
    this.editingField = field;
    if (field === 'buttonText') {
      this.editButton = this.navbarData.buttonText[0];
      this.editButtonUrl = this.navbarData.buttonText[1];
    }
  }

  saveField() {
    if (this.editingField === 'buttonText') {
      this.navbarData.buttonText[0] = this.editButton;
      this.navbarData.buttonText[1] = this.editButtonUrl;
    }
    this.editingField = null;
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.saveField();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  cancelEdit() {
    if (this.editingField === 'buttonText') {
      this.editButton = this.navbarData.buttonText[0];
      this.editButtonUrl = this.navbarData.buttonText[1];
    }
    this.editingField = null;
  }


  // ----------------------------------------------------

  // HeroSection Field
  // -----------------------------------------------------

  editingHeroSectionField: string | null = null;
  originalHeroSectionValue: any = null;
  editingHeroButtonText: string = '';
  editingHeroButtonUrl: string = '';

  startHeroEditing(field: string) {
    this.editingHeroSectionField = field;
  
    if (field === 'buttonText') {
      this.editingHeroButtonText = this.heroSectionData.buttonText[0];
      this.editingHeroButtonUrl = this.heroSectionData.buttonText[1];
    } else {
      this.originalHeroSectionValue = this.heroSectionData[field as keyof typeof this.heroSectionData];
    }
  }
  
  saveHeroField() {
    if (this.editingHeroSectionField === 'buttonText') {
      this.heroSectionData.buttonText[0] = this.editingHeroButtonText.replace(/\n/g, '').trim();
      this.heroSectionData.buttonText[1] = this.editingHeroButtonUrl.replace(/\n/g, '').trim();
    } else if (this.editingHeroSectionField && typeof this.heroSectionData[this.editingHeroSectionField as keyof typeof this.heroSectionData] === 'string') {
      this.heroSectionData[this.editingHeroSectionField as keyof typeof this.heroSectionData] = 
        (this.heroSectionData[this.editingHeroSectionField as keyof typeof this.heroSectionData] as string).replace(/\n/g, '').trim();
    }
  
    this.editingHeroSectionField = null;
    this.originalHeroSectionValue = null;
  
    console.log(this.heroSectionData);
  }
  
  cancelHeroEditing() {
    if (this.editingHeroSectionField === 'buttonText') {
      this.editingHeroButtonText = this.heroSectionData.buttonText[0];
      this.editingHeroButtonUrl = this.heroSectionData.buttonText[1];
    } else if (this.editingHeroSectionField) {
      this.heroSectionData[this.editingHeroSectionField as keyof typeof this.heroSectionData] = this.originalHeroSectionValue!;
    }

    this.editingHeroSectionField = null;
    this.originalHeroSectionValue = null;
  }
  
  handleHeroKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cancelHeroEditing();
    } else if (event.key === 'Enter') {
      this.saveHeroField();
    }
  }
  
  // -----------------------------------------------------------------------

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
