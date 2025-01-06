import { Component, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { MainService } from './main.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TextComponent } from '../text/text.component';
import { VideoComponent } from '../video/video.component';
import { ImageComponent } from '../image/image.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-main',
  imports: [CommonModule, RouterModule, TextComponent, VideoComponent, ImageComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  constructor(
    private mainService: MainService,
    private viewContainer: ViewContainerRef
  ) {}

  navbarData: any;
  @ViewChild('mySidenav') mySidenav!: ElementRef;
  objectKeys = Object.keys;

  
  textFromChild: string = '';

  dropdownSections = [
    { 
      name: 'Navbar', 
      isOpen: false, 
      links: ['Image', 'Text', 'Text'], 
      items: ['Logo', 'Li Items', 'CTA Button'] 
    },
    { 
      name: 'Hero', 
      isOpen: false, 
      links: ['Text', 'Text', 'Text', 'Video'], 
      items: ['Heading', 'Paragraph', 'Button', 'Video'] 
    },
    { 
      name: 'Features', 
      isOpen: false, 
      links: ['Text', 'Image', 'Text', 'Text', 'Image', 'Text', 'Text', 'Image', 'Text', 'Text'], 
      items: ['Heading','Feature 1 Logo', 'Feature 1 Heading', 'Feature 1 Paragraph', 'Feature 2 Logo', 'Feature 2 Heading', 'Feature 2 Paragraph','Feature 3 Logo', 'Feature 3 Heading', 'Feature  Paragraph'] 
    },
    { 
      name: 'Provider', 
      isOpen: false, 
      links: ['Text', 'Text', 'Text', 'Video'], 
      items: ['Heading', 'Paragraph', 'List Items', 'Video'] 
    },
    { 
      name: 'Counter', 
      isOpen: false, 
      links: ['Image', 'Text', 'Text', 'Image', 'Text', 'Text', 'Image', 'Text', 'Text'], 
      items: ['Logo 1', 'Numeric Value 1', 'Heading 1', 'Logo 2', 'Numeric Value 2', 'Heading 2', 'Logo 3', 'Numeric Value 3', 'Heading 3'] 
    },
    { 
      name: 'Tab', 
      isOpen: false, 
      links: ['Image', 'Text','Image', 'Image', 'Text','Image', 'Image', 'Text','Image'], 
      items: ['Tab Logo 1', 'Tab Heading 1', 'Tab Content 1', 'Tab Logo 2', 'Tab Heading 2', 'Tab Content 2', 'Tab Logo 3', 'Tab Heading 3', 'Tab Content 3'] 
    },
    { 
      name: 'Integrate', 
      isOpen: false, 
      links: ['Text', 'Text', 'Text', 'Text'], 
      items: ['Heading 6', 'Heading 3', 'Paragraph', 'Button'] 
    },
    // { 
    //   name: 'Industries', 
    //   isOpen: false, 
    //   links: ['Image', 'Image', 'Text', 'Text'], 
    //   items: ['Tab Icon', 'Tab Content', 'Tab Content Heading', 'Tab Content Paragraph'] 
    // },
    { 
      name: 'Why Burq?', 
      isOpen: false, 
      links: ['Text', 'Text', 'Text'], 
      items: ['Heading', 'Paragraph', 'Button'] 
    },
    { 
      name: 'Selling Points', 
      isOpen: false, 
      links: ['Image', 'Text', 'Text', 'Image', 'Text', 'Text', 'Image', 'Text', 'Text'], 
      items: ['Logo 1', 'Heading 1', 'Paragraph 1', 'Logo 2', 'Heading 2', 'Paragraph 2', 'Logo 3', 'Heading 3', 'Paragraph 3'] 
    },
    { 
      name: 'Testimonials', 
      isOpen: false, 
      links: ['Text', 'Text'], 
      items: ['Heading', 'Comment'] 
    },
    { 
      name: 'Backing', 
      isOpen: false, 
      links: ['Text', 'Text', 'Text'], 
      items: ['Heading', 'Title', 'Comment'] 
    },
    { 
      name: 'Powering', 
      isOpen: false, 
      links: ['Text', 'Text'], 
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

  receiveText(event: string) {
    this.textFromChild = event;
    console.log(this.textFromChild);
  }

  handleItemClick(link:string){
    console.log(link);
    if(link === 'Image'){
      this.viewContainer.clear();
      console.log('I');
      this.viewContainer.createComponent(ImageComponent);
      return;
    }
    if(link === 'Video'){
      this.viewContainer.clear();
      console.log('V');
      this.viewContainer.createComponent(VideoComponent);
      return;
    }
    else{
      this.viewContainer.clear();
      console.log('T');
      this.viewContainer.createComponent(TextComponent);
      return;
    }

  }
}