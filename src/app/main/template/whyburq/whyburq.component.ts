import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { MainService } from '../../main.service';
import { FormsModule } from '@angular/forms';
import { ImageComponent } from '../../image/image.component';

@Component({
  selector: 'app-template-whyburq',
  imports: [CommonModule, FormsModule, ImageComponent],
  templateUrl: './whyburq.component.html',
  styleUrl: './whyburq.component.less'
})

export class WhyburqTemplateComponent {
  whyBurqData: any;
  benefitsData: any;
  benefit: any;
  imagePublicUrl: string[] = ['whyburq', 'sp1', 'sp2', 'sp3']
  imageUrl: string[] = [];
  private subscription?: Subscription;

  @Input() fieldToUpdate!: string;
  @Output() whyburqEvent: EventEmitter<any> = new EventEmitter<any>();
  exportData: any;

  constructor(
    private http: HttpClient,
    private mainService: MainService,
  ) {}

  imageController(){
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
  }
  
  dataFunctions(): Observable<void> {
    return new Observable((observer) => {
      this.http.get<any>("http://localhost:3000/data/component/whyBurq").subscribe(
        (res) => {
          this.whyBurqData = res.data;
  
          this.http.get<any>("http://localhost:3000/data/component/sellingPoints").subscribe(
            (res) => {
              this.benefitsData = res.data;
  
              observer.next();
              observer.complete();
            },
            (err) => {
              console.log('Error fetching sellingPoints data:', err);
              observer.error(err);
            }
          );
        },
        (err) => {
          console.log('Error fetching whyBurq data:', err);
          observer.error(err);
        }
      );
    });
  }

  ngOnInit(){
    this.imageController();
    this.dataFunctions().subscribe({
      next: () => {
        this.setExport();
      },
      error: (err) => {
        console.log('Error in dataFunctions:', err);
      }
    });

    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataFunctions();
      }
    });
  }

  ngOnChanges(){
    if(this.fieldToUpdate === 'whyBurqHeading'){
      this.startEditingWhyBurq('title');
    }
    if(this.fieldToUpdate === 'whyBurqParagraph'){
      this.startEditingWhyBurq('body');
    }
    if(this.fieldToUpdate === 'whyBurqButton'){
      this.startEditingWhyBurq('button');
    }
    if(this.fieldToUpdate === 'whyBurqImage'){
      this.changeLogo(0);
    }
    if(this.fieldToUpdate === 'sellingPointsHeading1' || this.fieldToUpdate === 'sellingPointsHeading2' || this.fieldToUpdate === 'sellingPointsHeading3'){      
      let len = this.fieldToUpdate.length;
      let index = this.fieldToUpdate[len-1];
      this.benefit = "sp" + index;   
  
      this.startEditingBenefit(this.benefit, 0);
    }
    if(this.fieldToUpdate === 'sellingPointsBody1' || this.fieldToUpdate === 'sellingPointsBody2' || this.fieldToUpdate === 'sellingPointsBody3'){      
      let len = this.fieldToUpdate.length;
      let index = this.fieldToUpdate[len-1];
      this.benefit = "sp" + index;   
  
      this.startEditingBenefit(this.benefit, 1);
    }
    else if(this.fieldToUpdate === 'sellingPointsLogo1' || this.fieldToUpdate === 'sellingPointsLogo2' || this.fieldToUpdate === 'sellingPointsLogo3'){
      let len = this.fieldToUpdate.length;
      let index = parseInt(this.fieldToUpdate[len-1]);
      this.changeLogo(index);
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }


  // whyBurq
  // --------------------------------------------------------------
 
  editingWhyBurqField: string | null = null;
  originalWhyBurqValue: string | null = null;
  whyBurqUpdatedValue: string | null = null;
  whyBurqUpdatedButtonText: string | null = null;
  whyBurqUpdatedButtonUrl: string | null = null;

  startEditingWhyBurq(field: 'title' | 'body' | 'button') {
    this.editingWhyBurqField = field;

    if (field === 'button') {
      this.originalWhyBurqValue = this.whyBurqData?.button[0] || '';
      this.whyBurqUpdatedButtonText = this.originalWhyBurqValue;
      this.whyBurqUpdatedButtonUrl = this.whyBurqData?.button[1] || '';
    } else {
      this.whyBurqUpdatedValue = this.whyBurqData[field];
    }
  }

  saveWhyBurqField() {
    if (this.editingWhyBurqField === 'button') {
      this.whyBurqData.button[0] = this.whyBurqUpdatedButtonText?.replace(/\n/g, '').trim();
      this.whyBurqData.button[1] = this.whyBurqUpdatedButtonUrl?.replace(/\n/g, '').trim();
    } else if (this.editingWhyBurqField && this.whyBurqUpdatedValue !== null) {
      this.whyBurqData[this.editingWhyBurqField] = this.whyBurqUpdatedValue.replace(/\n/g, '').trim();
    }

    this.resetWhyBurqEditing();
    this.setExport();
  }

  cancelWhyBurqEditing() {
    if (this.editingWhyBurqField === 'button') {
      this.whyBurqUpdatedButtonText = this.originalWhyBurqValue;
      this.whyBurqUpdatedButtonUrl = this.whyBurqData?.button[1] || '';
    } else if (this.editingWhyBurqField) {
      this.whyBurqData[this.editingWhyBurqField] = this.originalWhyBurqValue!;
    }

    this.resetWhyBurqEditing();
  }

  resetWhyBurqEditing() {
    this.editingWhyBurqField = null;
    this.originalWhyBurqValue = null;
    this.whyBurqUpdatedValue = null;
    this.whyBurqUpdatedButtonText = null;
    this.whyBurqUpdatedButtonUrl = null;
  }

  handleWhyBurqKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.resetWhyBurqEditing();
    } else if (event.key === 'Enter') {
      this.saveWhyBurqField();
    }
  }

  // Selling Points 
  // -----------------------------------------------------------------------

  editingBenefitField: string | null = null;
  updatedBenefitValue: string | null = null;

  startEditingBenefit(field: 'sp1' | 'sp2' | 'sp3', index: number) {
    this.editingBenefitField = `${field}-${index}`;
    this.updatedBenefitValue = this.benefitsData[field][index];
  }

  saveBenefitField() {
    if (this.editingBenefitField) {
      const [field, index] = this.editingBenefitField.split('-');
      const idx = parseInt(index, 10);

      this.updatedBenefitValue = (this.updatedBenefitValue ?? '').replace(/\n/g, ' ').trim();
      
      this.benefitsData[field as 'sp1' | 'sp2' | 'sp3'][idx] = this.updatedBenefitValue!;
      
      this.editingBenefitField = null;
      this.updatedBenefitValue = null;
      this.setExport();

      // console.log(this.benefitsData);
    }
  }
  
  

  handleBenefitKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.editingBenefitField = null;
      this.updatedBenefitValue = null;
    } else if (event.key === 'Enter') {
      this.saveBenefitField();
    }
  }


  setExport(){
    this.exportData = {
      "whyBurq": this.whyBurqData,
      "sellingPoints" : this.benefitsData
    }
    this.whyburqEvent.emit(this.exportData);
  }

  publicID: string = '';
  change: boolean = false;

  changeLogo(index: any) {
    if (typeof index !== 'string') {
      this.publicID = this.imagePublicUrl[index];
      this.change = !this.change;
    } else {
      this.change = !this.change;
    }
  }
}