import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.less'],
  imports:[CommonModule, FormsModule]
})
export class TestimonialsTemplateComponent {
  constructor(
    private http: HttpClient
  ) {}

  @Input() fieldToUpdate!: string;
  @Output() testimonialsEvent = new EventEmitter<any>();

  testimonialData: any;
  objectKeys = Object.keys;
  comment!: string;

  dataFunction(): Observable<void> {
    return new Observable((observer) => {
      this.http.get<any>("http://localhost:3000/data/component/testimonials").subscribe(
        (res) => {
          this.testimonialData = res.data;
  
          observer.next();
          observer.complete();
        },
        (err) => {
          console.log('Error fetching testimonials data:', err);
          observer.error(err);
        }
      );
    });
  }

  ngOnInit(){
    this.dataFunction().subscribe({
      next: () => {
        this.setExport();
      },
      error: (err) => {
        console.log('Error in dataFunction:', err);
      }
    });
  }

  currentSlide = 0;
  slides: HTMLElement[] = [];
  totalSlides: number = 0;

  isEditing = false;
  isEditingComment = false;
  editedTitle = '';

  ngOnChanges(){
    if(this.fieldToUpdate === 'testimonialtitle' || this.fieldToUpdate === 'client1' || this.fieldToUpdate === 'client2'
      || this.fieldToUpdate === 'client3' || this.fieldToUpdate === 'client4' || this.fieldToUpdate === 'client5'
    ){
      let len = this.fieldToUpdate.length;
      if(this.fieldToUpdate[len-1] === '1' || this.fieldToUpdate[len-1] === '2' ||
        this.fieldToUpdate[len-1] === '3' || this.fieldToUpdate[len-1] === '4' || this.fieldToUpdate[len-1] === '5'
      ){
        this.comment = this.fieldToUpdate;
        this.enableCommentEdit();
      }
      else if(this.fieldToUpdate === 'testimonialtitle'){
        this.edit();
      }
    }
  }

  setExport(){
    this.testimonialsEvent.emit(this.testimonialData);
  }

  edit() {
    this.editedTitle = this.testimonialData?.title;
    this.isEditing = true;
  }

  save() {
    this.testimonialData.title = this.editedTitle;
    this.isEditing = false;
    this.setExport();
  }

  cancel() {
    this.isEditing = false;
  }

  editedComment = '';

  enableCommentEdit() {
    this.isEditingComment = true;
    this.editedComment = this.testimonialData.comment[this.comment][0];
  }

  saveCommentEdit() {
    this.testimonialData.comment[this.comment][0] = this.editedComment;
    this.isEditingComment = false;
    this.setExport();
  }

  cancelCommentEdit() {
    this.isEditingComment = false;
  }

  editedName = '';

  enableNameEdit() {
    this.isEditingComment = true;
    this.editedName = this.testimonialData.comment[this.comment][1];
  }

  saveNameEdit() {
    this.testimonialData.comment[this.comment][1] = this.editedName;
    this.isEditingComment = false;
    this.setExport();
  }

  cancelNameEdit() {
    this.isEditingComment = false;
  }

  editedDesignation = '';

  enableDesignationEdit() {
    this.isEditingComment = true;
    this.editedDesignation = this.testimonialData.comment[this.comment][2];
  }

  saveDesignationEdit() {
    this.testimonialData.comment[this.comment][2] = this.editedDesignation;
    this.isEditingComment = false;
    this.setExport();
  }

  cancelDesignationEdit() {
    this.isEditingComment = false;
  }
}
