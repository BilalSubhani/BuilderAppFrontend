import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { MainService } from '../../main.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template-backing',
  imports: [CommonModule, FormsModule],
  templateUrl: './backing.component.html',
  styleUrl: './backing.component.less'
})
export class BackingTemplateComponent {
  private subscription?: Subscription;
  constructor(
    private http: HttpClient,
    private mainService: MainService,
  ){}

  backingData: any;
  poweringData: any;

  dataFunctions(): void{
    this.http.get<any>("http://localhost:3000/data/component/backing").subscribe((res)=>{
      this.backingData = res.data;
    }, (err)=>{
      console.log(err);
    });

    this.http.get<any>("http://localhost:3000/data/component/startPowering").subscribe((res)=>{
      this.poweringData = res.data;
    }, (err)=>{
      console.log(err);
    });
  }

  ngOnInit(){
    this.dataFunctions();

    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataFunctions();
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
 
  // Backing
  editingField: string | null = null;
  updatedValue: string = '';

  startEditing(field: 'title' | 'body') {
    this.editingField = field;
    this.updatedValue = this.backingData[field];
  }

  saveField() {
    if (this.editingField) {
      this.backingData[this.editingField] = this.updatedValue;
      this.editingField = null;
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cancelEditing();
    } else if (event.key === 'Enter') {
      this.saveField();
    }
  }

  cancelEditing() {
    this.editingField = null;
    this.updatedValue = '';
  }


  // Powering
  updatedPoweringValue: string = '';
  editingPoweringField: string | null = null;

  startPoweringEditing(field: 'body' | 'button') {
    this.editingPoweringField = field;
    this.updatedPoweringValue = this.poweringData[field];
  }

  savePoweringField() {
    if (this.editingPoweringField) {
      this.poweringData[this.editingPoweringField] = this.updatedPoweringValue;
    }
    this.editingPoweringField = null;

    // console.log(this.poweringData);
  }

  handlePoweringKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cancelPoweringEditing();
    } else if (event.key === 'Enter') {
      this.savePoweringField();
    }
  }

  cancelPoweringEditing() {
    if (this.editingPoweringField) {
      this.updatedPoweringValue = this.poweringData[this.editingPoweringField];
    }
    this.editingPoweringField = null;
  }
}