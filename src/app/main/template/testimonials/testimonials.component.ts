import { Component, AfterViewInit, Inject, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.less'],
  imports:[CommonModule, FormsModule]
})
export class TestimonialsTemplateComponent implements AfterViewInit {

  private subscription?: Subscription;
  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
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
    if(this?.fieldToUpdate === 't' || this?.fieldToUpdate[0] === 'c'){
      let len = this.fieldToUpdate.length;
      if(this.fieldToUpdate[len-1] === '1' || this.fieldToUpdate[len-1] === '2' ||
        this.fieldToUpdate[len-1] === '3' || this.fieldToUpdate[len-1] === '4' || this.fieldToUpdate[len-1] === '5'
      ){
        this.comment = this.fieldToUpdate;
        this.isEditingComment = true;
      }
      else{
        this.isEditing = true;
      }
    }
  }

  ngAfterViewInit() {
    this.slides = Array.from(this.document.querySelectorAll('.slide'));
    this.totalSlides = this.slides.length;
    const nextButton = this.document.getElementById('next');
    const prevButton = this.document.getElementById('prev');
    // this.currentSlide = 0;
    this.showSlide(this.currentSlide);
    if (nextButton) {
      nextButton.addEventListener('click', () => this.nextSlide());
    }
    if (prevButton) {
      prevButton.addEventListener('click', () => this.prevSlide());
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  showSlide(index: number) {
    this.slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
    });
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    // console.log((this.currentSlide + 1) % this.totalSlides);
    this.showSlide(this.currentSlide);
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.showSlide(this.currentSlide);
  }

  setExport(){
    this.testimonialsEvent.emit(this.testimonialData);
  }

  // Editable
  edit() {
    this.editedTitle = this.testimonialData?.title;
    this.isEditing = true;
  }

  save() {
    this.testimonialData.title = this.editedTitle;
    this.isEditing = false;
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
  }

  cancelDesignationEdit() {
    this.isEditingComment = false;
  }
}
