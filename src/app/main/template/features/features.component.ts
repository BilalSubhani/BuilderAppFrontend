import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MainService } from '../../main.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template-features',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.less'
})
export class FeaturesTemplateComponent {
  
  imagePublicUrl: string[] = ['lines', 'featureTile1', 'featureTile2', 'featureTile3'];
  imageUrl: string[] = [];
  featuresData: any;

  @Output() featuresDataEvent: EventEmitter<any> = new EventEmitter<any>();

  private subscription?: Subscription;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private mainService: MainService
  ){}


  // Editable
  // -------------------------------------------------------------------
  
  editingField: string | null = null;
  originalValue: string | null = null;

  updatedValue: string | null = null;

  startEditing(field: 'title' | 'tile1' | 'tile2' | 'tile3', index: number) {
    this.editingField = `${field}-${index}`;
    
    if (field === 'title') {
      this.originalValue = this.featuresData.title;
      this.updatedValue = this.featuresData.title;
      // console.log(this.updatedValue);
    } else {
      const tileKey = field;
      const fieldKey = index === 0 ? 0 : 1;
      this.originalValue = this.featuresData.featureTiles[tileKey][fieldKey];
      this.updatedValue = this.featuresData.featureTiles[tileKey][fieldKey];
    }
  }

  saveField() {
    if (this.editingField && this.updatedValue !== null) {
      const [field, index] = this.editingField.split('-');
      const idx = parseInt(index, 10);

      if (field === 'title') {
        this.featuresData.title = this.updatedValue;
      } else {
        const tileKey = field;
        const fieldKey = idx === 0 ? 0 : 1;
        this.featuresData.featureTiles[tileKey][fieldKey] = this.updatedValue;
      }
      // console.log('Updated Data:', this.featuresData);
    }

    this.editingField = null;
    this.originalValue = null;
    this.updatedValue = null;

    this.setExport();
  }

  cancelEditing() {
    if (this.editingField) {
      const [field, index] = this.editingField.split('-');
      const idx = parseInt(index, 10);

      if (field === 'title') {
        this.featuresData.title = this.originalValue!;
      } else {
        const tileKey = field;
        const fieldKey = idx === 0 ? 0 : 1;
        this.featuresData.featureTiles[tileKey][fieldKey] = this.originalValue!;
      }
      // console.log('Editing Canceled:', this.featuresData);
    }

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
    });

    this.http.get<any>('http://localhost:3000/data/component/features').subscribe(
      (res: any)=>{
        this.featuresData=res.data;
      }, (err) =>{
      }
    );

    this.mainService.notifyDataChange(false);
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

  setExport(){
    this.featuresDataEvent.emit(this.featuresData);
  }
}