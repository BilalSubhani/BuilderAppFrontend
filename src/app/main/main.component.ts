import { Component, ViewChild, ElementRef } from '@angular/core';
import { MainService } from './main.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  constructor(private mainService: MainService) {}

  navbarData: any;
  @ViewChild('mySidenav') mySidenav!: ElementRef;
  objectKeys = Object.keys;

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

  ngOnInit() {
    this.getNavbarData();
  }

  getNavbarData() {
    this.mainService.getNavbar().subscribe(data => {
      this.navbarData = data;
      // this.displayNavbarData();
    });
  }

  // displayNavbarData() {
  //   console.log(this.navbarData);
  // }
}