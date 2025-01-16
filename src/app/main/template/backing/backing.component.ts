import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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

  @Output() backingDataEvent: EventEmitter<any> = new EventEmitter<any>();
  exportBackingData: any;

  dataFunctions(): Observable<void> {
    return new Observable((observer) => {
      this.http.get<any>("http://localhost:3000/data/component/backing").subscribe((res) => {
        this.backingData = res.data;

        this.http.get<any>("http://localhost:3000/data/component/startPowering").subscribe((res) => {
          this.poweringData = res.data;
          observer.next();
          observer.complete();
        }, (err) => {
          console.log(err);
          observer.error(err);
        });
      }, (err) => {
        console.log(err);
        observer.error(err);
      });
    });
  }
  
  ngOnInit(){
    this.dataFunctions().subscribe({
      next: () => {
        this.setExportData();
      },
      error: (err) => {
        console.log('Error fetching data:', err);
      }
    });
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

    this.setExportData();
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
  //---------------------------------------------------------

  updatedPoweringValue: string = '';
  updatedPoweringButtonText: string = '';
  updatedPoweringButtonUrl: string = '';
  editingPoweringField: string | null = null;

  startPoweringEditing(field: 'body' | 'button') {
    this.editingPoweringField = field;

    if (field === 'button') {
      this.updatedPoweringButtonText = this.poweringData.button[0];
      this.updatedPoweringButtonUrl = this.poweringData.button[1];
    } else {
      this.updatedPoweringValue = this.poweringData[field];
    }
  }

  savePoweringField() {
    if (this.editingPoweringField === 'button') {
      this.poweringData.button[0] = this.updatedPoweringButtonText.trim();
      this.poweringData.button[1] = this.updatedPoweringButtonUrl.trim();
    } else if (this.editingPoweringField && this.updatedPoweringValue !== '') {
      this.poweringData[this.editingPoweringField] = this.updatedPoweringValue.trim();
    }
    this.editingPoweringField = null;

    this.setExportData();
  }

  handlePoweringKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cancelPoweringEditing();
    } else if (event.key === 'Enter') {
      this.savePoweringField();
    }
  }

  cancelPoweringEditing() {
    if (this.editingPoweringField === 'button') {
      this.updatedPoweringButtonText = this.poweringData.button[0];
      this.updatedPoweringButtonUrl = this.poweringData.button[1];
    } else if (this.editingPoweringField) {
      this.updatedPoweringValue = this.poweringData[this.editingPoweringField];
    }
    this.editingPoweringField = null;
  }

  setExportData(){
    if(this.backingData !== 'undefined' && this.poweringData !== 'undefined'){
      this.exportBackingData = {
        "backing": this.backingData,
        "startPowering": this.poweringData
      }
      this.backingDataEvent.emit(this.exportBackingData);
    }
  }
}