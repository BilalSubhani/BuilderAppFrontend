import { Component, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { MainService } from './main.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { io } from 'socket.io-client';
import { TemplateComponent } from './template/template.component';

@Component({
  selector: 'app-main',
  imports: [CommonModule, RouterModule, TemplateComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  constructor(
    private mainService: MainService,
    private viewContainer: ViewContainerRef
  ) {}

  // Variables for data uploading
  private socket: any;
  fieldClicked: string = '';
  elementClicked: string = '';
  updatedData: any;

  // Variables for data to be displayed or edited
  navbarData: any;
  existingData: any;
  fieldToUpdate!: string;

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
      url: ['', 'buttonText'],
      postion: 0
    },
    { 
      name: 'Hero', 
      comp: 'heroSection',
      isOpen: false, 
      links: ['Text', 'Text', 'Text', 'Video'], 
      items: ['Heading', 'Paragraph', 'Button', 'Video'],
      url: ['heading', 'paragraph', 'buttonText', '3steps'],
      postion: 0
    },
    { 
      name: 'Features', 
      comp: 'features',
      isOpen: false, 
      links: ['Text'], 
      items: ['Heading'],
      url: ['title'],
      postion: 530
    },
    { 
      name: 'Provider',
      comp: 'providers', 
      isOpen: false, 
      links: ['Text', 'Text', 'Video'], 
      items: ['Heading', 'Paragraph', 'Video'],
      url: ['title', 'body', 'provider'],
      postion: 1200
    },
    { 
      name: 'Tab', 
      comp: 'tabs',
      isOpen: false, 
      links: ['Text','Image', 'Text', 'Image', 'Text','Image'], 
      items: [
        'Tab Icon 1', 'Tab Heading 1', 'Tab Content 1', 
        'Tab Icon 2', 'Tab Heading 2', 'Tab Content 2', 
        'Tab Icon 3', 'Tab Heading 3', 'Tab Content 3'
      ],
      url: [ 
        'tab1', '0', 'tabContent1', 
        'tab2', '1', 'tabContent2', 
        'tab3', '2', 'tabContent3' 
      ],
      postion: 1900
    },
    { 
      name: 'Integrate', 
      comp: 'integrate',
      isOpen: false, 
      links: ['Text', 'Text', 'Text', 'Text'], 
      items: ['Heading 6', 'Heading 3', 'Paragraph', 'Button'],
      url: ['smallHeading', 'title', 'body', 'button'],
      postion: 2500
    },
    { 
      name: 'Industries', 
      comp: 'industries',
      isOpen: false, 
      links: ['Image', 'Image', 'Text', 'Text'], 
      items: ['Heading', 
        'Tab 1 Content', 'Tab 1 Heading', 'Tab 1 Paragraph',
        'Tab 2 Content', 'Tab 2 Heading', 'Tab 2 Paragraph',
        'Tab 3 Content', 'Tab 3 Heading', 'Tab 3 Paragraph',
        'Tab 4 Content', 'Tab 4 Heading', 'Tab 4 Paragraph',
        'Tab 5 Content', 'Tab 5 Heading', 'Tab 5 Paragraph',
        'Tab 6 Content', 'Tab 6 Heading', 'Tab 6 Paragraph',
        'Tab 7 Content', 'Tab 7 Heading', 'Tab 7 Paragraph'
      ],
      url: ['heading', 
        'industriesContent1', 'tc10', 'tc11',
        'industriesContent2', 'tc20', 'tc21',
        'industriesContent3', 'tc30', 'tc31',
        'industriesContent4', 'tc40', 'tc41',
        'industriesContent5', 'tc50', 'tc51',
        'industriesContent6', 'tc60', 'tc61',
        'industriesContent7', 'tc70', 'tc71'
      ],
      postion: 3080
    },
    { 
      name: 'Why Burq?', 
      comp: 'whyBurq',
      isOpen: false, 
      links: ['Text', 'Text', 'Text'], 
      items: ['Heading', 'Paragraph', 'Button'],
      url: ['title', 'body', 'button'],
      postion: 3800
    },
    { 
      name: 'Selling Points', 
      comp: 'sellingPoints',
      isOpen: false, 
      links: ['Image', 'Text', 'Text', 'Image', 'Text', 'Text', 'Image', 'Text', 'Text'], 
      items: ['Logo 1', 'Heading 1', 'Paragraph 1', 'Logo 2', 'Heading 2', 'Paragraph 2', 'Logo 3', 'Heading 3', 'Paragraph 3'],
      url: ['', 'sp1', 'sp1', 'sp2', 'sp2', 'sp3', 'sp3'],
      postion: 4200
    },
    { 
      name: 'Testimonials', 
      comp: 'testimonials',
      isOpen: false, 
      links: ['Text'], 
      items: ['Title', 
        'Comment 1',
        'Comment 2',
        'Comment 3',
        'Comment 4',
        'Comment 5'
      ],
      url: ['title', 
        'client1',
        'client2', 
        'client3',
        'client4',
        'client5',
      ],
      postion: 4700
    },
    { 
      name: 'Backing', 
      comp: 'backing',
      isOpen: false, 
      links: ['Text', 'Text'], 
      items: ['Title', 'Button'] ,
      url: ['title', 'button'],
      postion: 5150
    },
    { 
      name: 'Powering', 
      comp: 'startPowering',
      isOpen: false, 
      links: ['Text', 'Text'], 
      items: ['Title', 'Button'],
      url: ['body', 'button'],
      postion: 5700
    }
  ];

  toggleDropdown(event: Event, sectionName: string, sectionPostion: number) {
    const section = this.dropdownSections.find(sec => sec.name === sectionName);
    if (section) {
      section.isOpen = !section.isOpen;
    }

    this.scrollTo(sectionPostion);
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

  handleFieldUpdation(field: any){
    this.fieldToUpdate = field;
  }
  onPublish(){
    this.mainService.createData(this.updatedData).subscribe({
      next: (response) => {
        //console.log('API Response:', response);
      },
      error: (err) => {
        console.error('Error occurred:', err);
      },
    });

    this.onSubmit();
    this.disconnectFromSocket();
    this.mainService.notifyDataChange(true);
  }

  connectToSocket(): void {
    this.socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      //console.log('Connected to server with ID:', this.socket.id);
      this.onPublish();
    });

    this.socket.on('connect_error', (err: any) => {
      console.error('Connection error:', err);
    });
  }

  disconnectFromSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      // console.log('Disconnected from the server');
    } else {
      console.log('Socket is not initialized or already disconnected');
    }
  }

  onSubmit() {
    if (this.socket && this.socket.connected) {
      this.socket.emit('changeDetected', "Data Changed!");
    } else {
      console.error('Socket is not connected');
    }
  }

  topFunction(): void {
    const scrollStep = -window.scrollY / (2000 / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  };

  scrollTo(compPoistion: any) {
    window.scrollTo({
      top: compPoistion,
      behavior: 'smooth'
    });
  }

  receiveUpdatedData(event: any){
    if (event.backing) {
      const body = {
        components: event
      };
      this.updatedData = body;
    }
  }
}