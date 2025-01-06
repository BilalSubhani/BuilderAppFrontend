import { Component, AfterViewInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.less']
})
export class TestimonialsComponent implements AfterViewInit {
  constructor(@Inject(DOCUMENT) private document: Document) {}

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

  showSlide(index: number) {
    this.slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
      // console.log(slide.style.display);
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
