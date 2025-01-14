import { Component, AfterViewInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-template-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.less'],
  imports:[CommonModule]
})
export class TestimonialsTemplateComponent implements AfterViewInit {

  private subscription?: Subscription;
  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  testimonialData: any;
  objectKeys = Object.keys;

  dataFunction(){
    this.http.get<any>("http://localhost:3000/data/component/testimonials").subscribe((res)=>{
      this.testimonialData = res.data;
    }, (err)=>{
      console.log(err);
    });

    this.http.get<any>("http://localhost:3000/data/component/testimonials").subscribe((res)=>{
      this.testimonialData = res.data;
    }, (err)=>{
      console.log(err);
    });
  }

  ngOnInit(){
    this.dataFunction();
  }

  currentSlide = 0;
  slides: HTMLElement[] = [];
  totalSlides: number = 0;
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
}
