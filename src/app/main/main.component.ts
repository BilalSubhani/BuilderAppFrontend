import { Component, ViewChild, ElementRef } from '@angular/core';
import { MainService } from './main.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [CommonModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  constructor(private mainService: MainService) {}

  navbarData: any;
  @ViewChild('mySidenav') mySidenav!: ElementRef;
  objectKeys = Object.keys;

  dropdownSections = [
    { 
      name: 'Navbar', 
      isOpen: false, 
      link: '/main/home', 
      items: ['Logo', 'Li Items', 'Dropdown Items', 'CTA Button'] 
    },
    { 
      name: 'Hero', 
      isOpen: false, 
      link: '/main/home', 
      items: ['Heading', 'Paragraph', 'Button', 'Video'] 
    },
    { 
      name: 'Features', 
      isOpen: false, 
      link: '/main/home', 
      items: ['Feature 1 Logo', 'Feature 1 Heading', 'Feature 1 Paragraph', 'Feature 2 Logo', 'Feature 2 Heading'] 
    },
    { 
      name: 'Provider', 
      isOpen: false, 
      link: '/main/provider', 
      items: ['Heading', 'Paragraph', 'List Items', 'Video'] 
    },
    { 
      name: 'Counter', 
      isOpen: false, 
      link: '/main/provider', 
      items: ['Logo 1', 'Numeric Value 1', 'Heading 1'] 
    },
    { 
      name: 'Tab', 
      isOpen: false, 
      link: '/main/tabs', 
      items: ['Tab Logo', 'Tab Heading'] 
    },
    { 
      name: 'Integrate', 
      isOpen: false, 
      link: '/main/integrate', 
      items: ['Heading 6', 'Heading 3'] 
    },
    { 
      name: 'Industries', 
      isOpen: false, 
      link: '/main/industries', 
      items: ['Tab Icon', 'Tab Content Heading'] 
    },
    { 
      name: 'Why Burq?', 
      isOpen: false, 
      link: '/main/whyburq', 
      items: ['Image', 'Heading', 'Paragraph'] 
    },
    { 
      name: 'Selling Points', 
      isOpen: false, 
      link: '/main/whyburq', 
      items: ['Logo 1', 'Heading 1'] 
    },
    { 
      name: 'Testimonials', 
      isOpen: false, 
      link: '/main/testimonials', 
      items: ['Heading', 'Comment'] 
    },
    { 
      name: 'Backing', 
      isOpen: false, 
      link: '/main/backing', 
      items: ['Heading', 'Passage'] 
    },
    { 
      name: 'Powering', 
      isOpen: false, 
      link: '/main/backing', 
      items: ['Heading', 'Button'] 
    }
  ];

  openNav() {
    this.mySidenav.nativeElement.style.width = '250px';
  }

  closeNav() {
    this.mySidenav.nativeElement.style.width = '0';
  }

  toggleDropdown(event: Event, sectionName: string) {
    const section = this.dropdownSections.find(sec => sec.name === sectionName);
    if (section) {
      section.isOpen = !section.isOpen;
    }
  }

  ngOnInit() {
    this.getNavbarData();
  }

  getNavbarData() {
    this.mainService.getNavbar().subscribe(data => {
      this.navbarData = data;
    });
  }
}
