import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ImageComponent } from '../../image/image.component';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-template-footer',
  imports: [CommonModule, ImageComponent, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.less'
})

export class FooterTemplateComponent {
  imageUrl: string = '';
  footerData: any;

  @Output() footerDataEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() fieldToUpdate!: string;
  
  constructor(
    private http: HttpClient
  ){}

  dataFunction(): Observable<void> {
      return new Observable((observer) => {
        this.http.get<any>('http://localhost:3000/data/component/footer').subscribe(
          (res: any) => {
            this.footerData= {...this.footerData, ...res.data};
            
            observer.next();
            observer.complete();
          },
          (err) => {
            console.log('Error fetching features data:', err);
            observer.error(err);
          }
        );
      });
    }

  ngOnInit(){
    this.http.get<any>(`http://localhost:3000/media/images/footerLogo`).subscribe(
      (response: any) => {
        this.imageUrl = response.url;
      },
      (error) => {
        console.log(error);
      }
    );
    
    this.dataFunction().subscribe({
      next: () => {
        this.setExport();
      },
      error: (err) => {
        console.log('Error in dataFunction:', err);
      }
    });
  }

  ngOnChanges(){
    if(this.fieldToUpdate === 'footerLogo'){
      this.changeLogo(1);
    }
    if(this.fieldToUpdate === 'footerList1' || this.fieldToUpdate === 'footerList2' || this.fieldToUpdate === 'footerList3' || this.fieldToUpdate === 'footerList4'){
      let len = this.fieldToUpdate.length;
      let index = parseInt(this.fieldToUpdate[len-1]) - 1;
      this.enableEditKey(index);
    }
    if(this.fieldToUpdate === 'footerSocialLink1' || this.fieldToUpdate === 'footerSocialLink2'){
      let len = this.fieldToUpdate.length;
      let index = parseInt(this.fieldToUpdate[len-1]) - 1;
      this.enableEditSocial(index);
    }
  }

  publicID: string = '';
  change: boolean = false;

  changeLogo(index: any) {
    if (typeof index !== 'string') {
      this.publicID = "footerLogo";
      this.change = !this.change;
    } else {
      this.change = !this.change;
    }
  }

  setExport(){
    this.footerDataEvent.emit(this.footerData);
  }

  editingKeyIndex = new Set<number>();
  editKeyValue = '';
  editingValueIndex = new Set<string>();
  editValue = '';

  enableEditKey(index: number) {
    this.editingKeyIndex.add(index);
    this.editKeyValue = this.footerData.listItems[index].key;
  }

  saveKeyEdit(index: number) {
    this.footerData.listItems[index].key = this.editKeyValue;
    this.editingKeyIndex.delete(index);
  }

  cancelKeyEdit() {
    this.editingKeyIndex.clear();
  }

  enableEditValue(listIndex: number, valueIndex: number): void {
    const compositeIndex = `${listIndex}-${valueIndex}`;
    this.editingValueIndex.add(compositeIndex);
    this.editValue = this.footerData.listItems[listIndex].values[valueIndex];
  }
  
  saveValueEdit(listIndex: number, valueIndex: number): void {
    const compositeIndex = `${listIndex}-${valueIndex}`;
    if (this.editValue.trim()) {
      this.footerData.listItems[listIndex].values[valueIndex] = this.editValue.trim();
    }
    this.editingValueIndex.delete(compositeIndex);
    this.setExport();
  }
  
  cancelValueEdit(listIndex: number, valueIndex: number): void {
    const compositeIndex = `${listIndex}-${valueIndex}`;
    this.editingValueIndex.delete(compositeIndex);
  }
  
  

  editingSocial: number | null = null;
  editSocial = '';

  enableEditSocial(index: number){
    this.editingSocial = index;
    this.editSocial = this.footerData.socialLinks[index];
  }

  saveSocialEdit(index: number){
    this.footerData.socialLinks[index] = this.editSocial;
    this.editingSocial = null;
    this.setExport();
  }

  cancelSocialEdit(){ 
    this.editingSocial = null;
  }
}