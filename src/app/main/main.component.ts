import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent {

  @ViewChild('mySidenav') mySidenav!: ElementRef;

  openNav() {
    console.log('button clicked');
    this.mySidenav.nativeElement.style.width = '250px';
  }

  closeNav() {
    this.mySidenav.nativeElement.style.width = '0';
  }

  toggleDropdown(event: Event) {
    const target = event.target as HTMLElement;
    const dropdownContent = target.nextElementSibling as HTMLElement;
    if (dropdownContent.style.display === 'block') {
      dropdownContent.style.display = 'none';
    } else {
      dropdownContent.style.display = 'block';
    }
  }
}