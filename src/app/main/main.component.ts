import { Component } from '@angular/core';
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
    private mainService: MainService
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
  objectKeys = Object.keys;

  isLoading = true;

  dropdownSections = [
    { 
      name: 'Navbar', 
      comp: 'navbar',
      isOpen: false, 
      items: ["Logo", "List 1", "List 2", "List 3", "CTA Button"],
      url: ["navLogo", "navList1", "navList2", "navList3", "navButton"],
      postion: 0
    },
    { 
      name: 'Hero', 
      comp: 'heroSection',
      isOpen: false, 
      items: ['Heading', 'Paragraph', 'Button', 'Video'],
      url: ["heroHeading", "heroParagraph", "heroButton", "heroVideo"],
      postion: 0
    },
    { 
      name: 'Features', 
      comp: 'features',
      isOpen: false,  
      items: ['Heading', 'Tile 1 Heading', 'Tile 1 Body', 'Tile 2 Heading', 'Tile 2 Body', 'Tile 3 Heading', 'Tile 3 Body'],
      url: ["featuresHeading", "featuresTileheading1", "featuresTilebody1","featuresTileheading2", "featuresTilebody2", "featuresTileheading3", "featuresTilebody3"],
      postion: 530
    },
    { 
      name: 'Provider',
      comp: 'providers', 
      isOpen: false, 
      items: ['Heading', 'Paragraph', 'List Item 1', 'List Item 2', 'List Item 3', 'List Item 4', "Counter 1", "Counter 2", "Counter 3"],
      url: ["providerHeading", "providerParagraph", "LI1", "LI2", "LI3", "LI4", "providerCounter1", "providerCounter2", "providerCounter3"],
      postion: 1200
    },
    { 
      name: 'Tab', 
      comp: 'tabs',
      isOpen: false, 
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
      items: ['Heading 6', 'Heading 3', 'Paragraph', 'Button'],
      url: ["integrateHeading6", "integrateHeading3", "integrateParagraph", "integrateButton"],
      postion: 2500
    },
    { 
      name: 'Industries', 
      comp: 'industries',
      isOpen: false,  
      items: ['Heading', 
        'Tab 1 Content',
        'Tab 2 Content',
        'Tab 3 Content', 
        'Tab 4 Content',
        'Tab 5 Content',
        'Tab 6 Content',
        'Tab 7 Content'
      ],
      url: ['heading', 
        'industriesContent1',
        'industriesContent2',
        'industriesContent3',
        'industriesContent4',
        'industriesContent5',
        'industriesContent6',
        'industriesContent7'
      ],
      postion: 3080
    },
    { 
      name: 'Why Burq?', 
      comp: 'whyBurq',
      isOpen: false, 
      items: ['Image','Heading', 'Paragraph', 'Button'],
      url: ["whyBurqImage","whyBurqHeading", "whyBurqParagraph", "whyBurqButton"],
      postion: 3800
    },
    { 
      name: 'Selling Points', 
      comp: 'sellingPoints',
      isOpen: false, 
      items: ['Logo 1', 'Heading 1','Body 1', 'Logo 2', 'Heading 2', 'Body 2', 'Logo 3', 'Heading 3', 'Body 3'],
      url: ["sellingPointsLogo1", "sellingPointsHeading1" ,"sellingPointsBody1", "sellingPointsLogo2", "sellingPointsHeading2", "sellingPointsBody2", "sellingPointsLogo3", "sellingPointsHeading3", "sellingPointsBody3"],
      postion: 4200
    },
    { 
      name: 'Testimonials', 
      comp: 'testimonials',
      isOpen: false, 
      items: ['Title', 
        'Comment 1',
        'Comment 2',
        'Comment 3',
        'Comment 4',
        'Comment 5'
      ],
      url: ['testimonialtitle', 
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
      items: ['Title', 'Body'] ,
      url: ["backingTitle", "backingBody"],
      postion: 5150
    },
    { 
      name: 'Powering', 
      comp: 'startPowering',
      isOpen: false,  
      items: ['Title', 'Button'],
      url: ["startPoweringTitle", "startPoweringButton"],
      postion: 5700
    },
    {
      name: 'Footer', 
      comp: 'footer',
      isOpen: false, 
      items: ["Logo", 'List Heading 1', 'List Heading 2', 'List Heading 3', 'List Heading 4', "Twitter Link", "LinkedIn Link"],
      url: ["footerLogo", 'footerList1', 'footerList2', 'footerList3', 'footerList4', "footerSocialLink1", "footerSocialLink2"],
      postion: 5900
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
    if (event.footer) {
      const body = {
        components: event
      };
      this.updatedData = body;
    }
  }
}