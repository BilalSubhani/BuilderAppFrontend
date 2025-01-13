import { Component, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { MainService } from './main.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TextComponent } from './text/text.component';
import { VideoComponent } from './video/video.component';
import { ImageComponent } from './image/image.component';

import { io } from 'socket.io-client';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-main',
  imports: [CommonModule, RouterModule, HomeComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  constructor(
    private mainService: MainService,
    // private websocketService: WebSocketService, 
    private viewContainer: ViewContainerRef
  ) {}

  // Variables for data uploading
  private socket: any;
  fieldClicked: string = '';
  elementClicked: string = '';
  videoUrl: string ='';

  // Variables for data to be displayed or edited
  navbarData: any;
  existingData: any;

  // Variables to detect changes in video, image and text from children component
  textData: boolean = false;
  videoData: boolean = false;
  imageData: boolean = false;
  textFromChild: string = '';
  videoChanged: string = '0';
  imageChanged: boolean=false;

  // Sidenav variables
  @ViewChild('mySidenav') mySidenav!: ElementRef;
  objectKeys = Object.keys;

  isLoading = true;

  dropdownSections = [
    { 
      name: 'Navbar', 
      comp: 'navbar',
      isOpen: false, 
      links: ['Image', 'Text'], 
      items: ['Logo', 'buttonText'],
      url: ['', 'buttonText']
    },
    { 
      name: 'Hero', 
      comp: 'heroSection',
      isOpen: false, 
      links: ['Text', 'Text', 'Text', 'Video'], 
      items: ['Heading', 'Paragraph', 'Button', 'Video'],
      url: ['heading', 'paragraph', 'buttonText', '3steps']
    },
    { 
      name: 'Features', 
      comp: 'features',
      isOpen: false, 
      links: ['Text'], 
      items: ['Heading'],
      url: ['title']
    },
    { 
      name: 'Provider',
      comp: 'providers', 
      isOpen: false, 
      links: ['Text', 'Text', 'Video'], 
      items: ['Heading', 'Paragraph', 'Video'],
      url: ['title', 'body', 'provider']
    },
    { 
      name: 'Tab', 
      comp: 'tabs',
      isOpen: false, 
      links: ['Text','Image', 'Text', 'Image', 'Text','Image'], 
      items: ['Tab Heading 1', 'Tab Content 1', 'Tab Heading 2', 'Tab Content 2', 'Tab Heading 3', 'Tab Content 3'],
      url: [ '0', '', '1', '', '2', '' ]
    },
    { 
      name: 'Integrate', 
      comp: 'integrate',
      isOpen: false, 
      links: ['Text', 'Text', 'Text', 'Text'], 
      items: ['Heading 6', 'Heading 3', 'Paragraph', 'Button'],
      url: ['smallHeading', 'title', 'body', 'button']
    },
    // { 
    //   name: 'Industries', 
    //   comp: 'industries',
    //   isOpen: false, 
    //   links: ['Image', 'Image', 'Text', 'Text'], 
    //   items: ['Tab Icon', 'Tab Content', 'Tab Content Heading', 'Tab Content Paragraph'],
    //   url: ['', '', '']
    // },
    { 
      name: 'Why Burq?', 
      comp: 'whyBurq',
      isOpen: false, 
      links: ['Text', 'Text', 'Text'], 
      items: ['Heading', 'Paragraph', 'Button'],
      url: ['title', 'body', 'button']
    },
    { 
      name: 'Selling Points', 
      comp: 'sellingPoints',
      isOpen: false, 
      links: ['Image', 'Text', 'Text', 'Image', 'Text', 'Text', 'Image', 'Text', 'Text'], 
      items: ['Logo 1', 'Heading 1', 'Paragraph 1', 'Logo 2', 'Heading 2', 'Paragraph 2', 'Logo 3', 'Heading 3', 'Paragraph 3'],
      url: ['', 'sp1', 'sp1', 'sp2', 'sp2', 'sp3', 'sp3']
    },
    { 
      name: 'Testimonials', 
      comp: 'testimonials',
      isOpen: false, 
      links: ['Text'], 
      items: ['Title'],
      url: ['title']
    },
    { 
      name: 'Backing', 
      comp: 'backing',
      isOpen: false, 
      links: ['Text', 'Text'], 
      items: ['Title', 'Button'] ,
      url: ['title', 'button']
    },
    { 
      name: 'Powering', 
      comp: 'startPowering',
      isOpen: false, 
      links: ['Text', 'Text'], 
      items: ['Title', 'Button'],
      url: ['body', 'button']
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
    this.getExistingData();
  }
  getNavbarData() {
    this.mainService.getNavbar().subscribe(data => {
      this.navbarData = data;
    });
  }
  getExistingData(){
    this.mainService.getAllData().subscribe((res) =>{
      this.existingData = res.data[0];
    }, (err)=>{
      console.log(err);
    })
  }

  handleItemClick(link:string, name: string, item: string){
    this.fieldClicked = name;
    this.elementClicked = item;
    this.videoUrl=item;

    if(link === 'Image'){
      this.videoData=false;
      this.textData=false;
      this.viewContainer.clear();
      this.imageData=true;
      return;
    }
    if(link === 'Video'){
      this.textData=false;
      this.imageData=false;
      this.viewContainer.clear();
      this.videoData=true;
      return;
    }
    else{
      this.videoData=false;
      this.imageData=false;
      this.viewContainer.clear();
      this.textData=true;
      return;
    }
  }

  receiveText(event: string) {
    this.textFromChild = event;

    if (this.textFromChild) {
      this.updateData();
    }
  }

  receiveImage(event: boolean){
    this.imageChanged = event;

    if(this.imageChanged){
      this.mainService.notifyDataChange(this.imageChanged);
      this.imageChanged = false;
    }
  }

  receiveVideo(event: string){
    this.videoChanged = event;

    if(this.videoChanged === '1'){
      this.mainService.notifyDataChange(true);
      this.videoChanged = '0';
    }
  }

  updateData(){
    this.existingData.components[this.fieldClicked][this.elementClicked] = this.textFromChild;
  }

  onPublish(){
    const id = this.existingData._id;

    const {_id, ...newData} = this.existingData.components;
    const body = {
      "components": newData
    };

    // console.log(body);

    this.mainService.createData(body).subscribe({
      next: (response) => {
        // console.log('API Response:', response);
      },
      error: (err) => {
        console.error('Error occurred:', err);
      },
    });

    this.onSubmit();
  }

  connectToSocket(): void {
    this.socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      // console.log('Connected to server with ID:', this.socket.id);
      this.onPublish();
    });

    this.socket.on('connect_error', (err: any) => {
      console.error('Connection error:', err);
    });
  }

  onSubmit() {
    if (this.socket && this.socket.connected) {
      this.socket.emit('changeDetected', "Data Changed!");
    } else {
      console.error('Socket is not connected');
    }
  }
}