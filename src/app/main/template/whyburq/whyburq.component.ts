import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MainService } from '../../main.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template-whyburq',
  imports: [CommonModule, FormsModule],
  templateUrl: './whyburq.component.html',
  styleUrl: './whyburq.component.less'
})

export class WhyburqTemplateComponent {
  whyBurqData: any;
  benefitsData: any;
  imagePublicUrl: string[] = ['whyburq', 'sp1', 'sp2', 'sp3']
  imageUrl: string[] = [];
  private subscription?: Subscription;

  @Output() whyburqEvent: EventEmitter<any> = new EventEmitter<any>();
  exportData: any;

  constructor(
    private http: HttpClient,
    private mainService: MainService,
  ) {}

  dataFunctions(): void{
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

    this.http.get<any>("http://localhost:3000/data/component/whyBurq").subscribe((res)=>{
      this.whyBurqData = res.data;
    }, (err)=>{
      console.log(err);
    });

    this.http.get<any>("http://localhost:3000/data/component/sellingPoints").subscribe((res)=>{
      this.benefitsData = res.data;
    }, (err)=>{
      console.log(err);
    });
  }


  ngOnInit(){
    this.dataFunctions();
    this.setExport();

    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataFunctions();
      }
    });
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
}