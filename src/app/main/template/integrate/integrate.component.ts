import { Component } from '@angular/core';
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

  startEditing(field: 'smallHeading' | 'title' | 'body' | 'button') {
    this.editingField = field;
    this.originalValue = this.integrateData[field];
    this.updatedValue = this.originalValue;
  }

  saveField() {
    if (this.editingField) {
      this.integrateData[this.editingField] = this.updatedValue!;
      //console.log('Updated Data:', this.integrateData);
    }
    this.resetEditing();
  }

  cancelEditing() {
    if (this.editingField) {
      this.integrateData[this.editingField] = this.originalValue!;
    }
    this.resetEditing();
  }

  resetEditing() {
    this.editingField = null;
    this.originalValue = null;
    this.updatedValue = null;
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cancelEditing();
    } else if (event.key === 'Enter') {
      this.saveField();
    }
  }

  // ----------------------------------------------------------------------------
}
