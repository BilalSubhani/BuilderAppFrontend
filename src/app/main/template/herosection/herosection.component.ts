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

  @ViewChild('editValueInput', { static: false }) editValueInput!: ElementRef;
  editingField: { type: 'value' | 'buttonText'; parentKey?: string; index?: number } | null = null;
  originalValue: string | null = null;
  editingHeroSectionField: string | null = null;
  originalHeroSectionValue: string | null = null; 

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

  startEditingNavbarField(type: 'value' | 'buttonText', parentKey?: string, index?: number) {
    this.editingField = { type, parentKey, index };

    if (type === 'value' && parentKey !== undefined && index !== undefined) {
      this.originalValue = this.navbarData.listItems[parentKey][index];
    } else if (type === 'buttonText') {
      this.originalValue = this.navbarData.buttonText;
    }
  }

  saveNavbarField() {
    this.editingField = null;
    this.originalValue = null;
    console.log('Updated Navbar Data:', this.navbarData);
  }

  cancelNavbarEditing() {
    if (this.editingField) {
      const { type, parentKey, index } = this.editingField;

      if (type === 'value' && parentKey !== undefined && index !== undefined) {
        this.navbarData.listItems[parentKey][index] = this.originalValue!;
      } else if (type === 'buttonText') {
        this.navbarData.buttonText = this.originalValue!;
      }
    }

    this.editingField = null;
    this.originalValue = null;
  }

  handleNavbarKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cancelNavbarEditing();
    } else if (event.key === 'Enter') {
      this.saveNavbarField();
    }
  }

  ngAfterViewChecked() {
    if (this.editingField?.type === 'value' && this.editValueInput) {
      this.editValueInput.nativeElement.focus();
    }
  }

  objectKeys(obj: object): string[] {
    return Object.keys(obj);
  }

  // ----------------------------------------------------

  // HeroSection Field
  // -----------------------------------------------------

  startEditing(field: string) {
    this.editingHeroSectionField = field;
    this.originalHeroSectionValue = this.heroSectionData[field as keyof typeof this.heroSectionData];
  }

  saveField() {
    this.editingHeroSectionField = null;
    this.originalHeroSectionValue = null;
    console.log('Updated Hero Section Data:', this.heroSectionData);
  }

  cancelEditing() {
    if (this.editingHeroSectionField) {
      this.heroSectionData[this.editingHeroSectionField as keyof typeof this.heroSectionData] = this.originalHeroSectionValue!;
    }
    this.editingHeroSectionField = null;
    this.originalHeroSectionValue = null;
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cancelEditing();
    } else if (event.key === 'Enter') {
      this.saveField();
    }
  }

  // -----------------------------------------------------------------------

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
