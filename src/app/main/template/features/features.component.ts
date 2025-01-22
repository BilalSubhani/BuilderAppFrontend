import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { MainService } from '../../main.service';
import { FormsModule } from '@angular/forms';
import { ImageComponent } from '../../image/image.component';

@Component({
  selector: 'app-template-features',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageComponent],
  templateUrl: './features.component.html',
  styleUrl: './features.component.less'
})
export class FeaturesTemplateComponent {
  
  imagePublicUrl: string[] = ['lines', 'featureTile1', 'featureTile2', 'featureTile3'];
  imageUrl: string[] = [];
  featuresData: any;

  @Output() featuresDataEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() fieldToUpdate!: string;

  private subscription?: Subscription;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private mainService: MainService
  ){}

  ngOnChanges(){
    if(this.fieldToUpdate === 'featuresHeading'){
      this.startEditing('title', 0);
    }
    if(this.fieldToUpdate === 'featuresTileheading1'){
      this.startEditing('tile1', 0);
    }
    if(this.fieldToUpdate === 'featuresTileheading2'){
      this.startEditing('tile2', 0);
    }
    if(this.fieldToUpdate === 'featuresTileheading3'){
      this.startEditing('tile3', 0);
    }

    if(this.fieldToUpdate === 'featuresTilebody1'){
      this.startEditing('tile1', 1);
    }
    if(this.fieldToUpdate === 'featuresTilebody2'){
      this.startEditing('tile2', 1);
    }
    if(this.fieldToUpdate === 'featuresTilebody3'){
      this.startEditing('tile3', 1);
    }
  }


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

  imageController(){
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
  }

  dataController(): Observable<void> {
    return new Observable((observer) => {
      this.http.get<any>('http://localhost:3000/data/component/features').subscribe(
        (res: any) => {
          this.featuresData = res.data;

          this.mainService.notifyDataChange(false);
          
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
    this.imageController();
  
    this.dataController().subscribe({
      next: () => {
        this.setExport();
      },
      error: (err) => {
        console.log('Error in dataController:', err);
      }
    });

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

  publicID: string ='';
  change: boolean = false;

  changeLogo(index: any){
    if(typeof index != 'string'){
      this.publicID=this.imagePublicUrl[index];
      this.change = !this.change;
    }
    else
      this.change = !this.change;
  }
}