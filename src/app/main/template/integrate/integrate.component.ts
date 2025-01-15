import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MainService } from '../../main.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template-integrate',
  templateUrl: './integrate.component.html',
  styleUrls: ['./integrate.component.less'],
  imports:[CommonModule, FormsModule]
})
export class IntegrateTemplateComponent {

  integrateData: any;
  imageUrl: string = '';
  private subscription?: Subscription;

  @Output() integratEvent: EventEmitter<any> = new EventEmitter<any> ();

  constructor(
    private http: HttpClient,
    private mainService: MainService,
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
    this.setExport();
    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataController();
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  // Editable
  // ----------------------------------------------------------------------------
  editingField: string | null = null;
  originalValue: string | null = null;
  updatedValue: string | null = null;
  updatedButtonText: string | null = null;
  updatedButtonUrl: string | null = null;

  startEditing(field: 'smallHeading' | 'title' | 'body' | 'buttonText' | 'buttonUrl') {
    this.editingField = field;

    if (field === 'buttonText') {
      this.originalValue = this.integrateData.button[0];
      this.updatedButtonText = this.originalValue;
      this.originalValue = this.integrateData.button[1];
      this.updatedButtonUrl = this.originalValue;
    } else {
      this.originalValue = this.integrateData[field];
      this.updatedValue = this.originalValue;
    }
  }

  saveField() {
    if (this.editingField === 'buttonText') {
      this.integrateData.button[0] = this.updatedButtonText?.replace(/\n/g, '').trim();
      if (this.updatedButtonUrl !== null) {
        this.integrateData.button[1] = this.updatedButtonUrl?.replace(/\n/g, '').trim();
      }
    } else if (this.editingField === 'buttonUrl') {
      this.integrateData.button[1] = this.updatedButtonUrl?.replace(/\n/g, '').trim();
    } else if (this.editingField && this.updatedValue !== null) {
      this.integrateData[this.editingField] = this.updatedValue.replace(/\n/g, '').trim();
    }
    this.resetEditing();
    this.setExport();
  }

  cancelEditing() {
    if (this.editingField === 'buttonText') {
      this.updatedButtonText = this.integrateData.button[0];
    } else if (this.editingField === 'buttonUrl') {
      this.updatedButtonUrl = this.integrateData.button[1];
    } else if (this.editingField) {
      this.integrateData[this.editingField] = this.originalValue!;
    }
    this.resetEditing();
  }

  resetEditing() {
    this.editingField = null;
    this.originalValue = null;
    this.updatedValue = null;
    this.updatedButtonText = null;
    this.updatedButtonUrl = null;
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cancelEditing();
    } else if (event.key === 'Enter') {
      this.saveField();
    }
  }

  // ----------------------------------------------------------------------------

  setExport(){
    this.integratEvent.emit(this.integrateData);
  }
}
