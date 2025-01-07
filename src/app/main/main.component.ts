import { Component, ViewChild, ElementRef, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { MainService } from './main.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TextComponent } from './text/text.component';
import { VideoComponent } from './video/video.component';
import { ImageComponent } from './image/image.component';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-main',
  imports: [CommonModule, RouterModule, TextComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  constructor(
    private mainService: MainService,
    private viewContainer: ViewContainerRef,
    private http: HttpClient
  ) {}

  navbarData: any;
  existingData: any;

  textData: boolean = false;

  textFromChild: string = '';
  fieldForText: string = '';
  textObject: object = { "Field":'', "Text":'' };
  @ViewChild('mySidenav') mySidenav!: ElementRef;
  @Output() textObjSent: EventEmitter<object> = new EventEmitter<object>();
  objectKeys = Object.keys;

  fieldClicked: string = '';
  elementClicked: string = '';


  dropdownSections = [
    { 
      name: 'Navbar', 
      comp: 'navbar',
      isOpen: false, 
      links: ['Image', 'Text', 'Text'], 
      items: ['Logo', 'buttonText'],
      url: ['', 'buttonText']
    },
    { 
      name: 'Hero', 
      comp: 'heroSection',
      isOpen: false, 
      links: ['Text', 'Text', 'Text', 'Video'], 
      items: ['Heading', 'Paragraph', 'Button', 'Video'],
      url: ['heading', 'paragraph', 'buttonText', '']
    },
    { 
      name: 'Features', 
      comp: 'features',
      isOpen: false, 
      links: ['Text', 'Image', 'Text', 'Text', 'Image', 'Text', 'Text', 'Image', 'Text', 'Text'], 
      items: ['Heading','Feature 1 Logo', 'Feature 1 Heading', 'Feature 1 Paragraph', 'Feature 2 Logo', 'Feature 2 Heading', 'Feature 2 Paragraph','Feature 3 Logo', 'Feature 3 Heading', 'Feature 3 Paragraph'],
      url: ['title', '', 'featureTiles', 'featureTiles', 'title', '', 'featureTiles', 'featureTiles', 'title', '', 'featureTiles', 'featureTiles']
    },
    { 
      name: 'Provider',
      comp: 'providers', 
      isOpen: false, 
      links: ['Text', 'Text', 'Text', 'Video'], 
      items: ['Heading', 'Paragraph', 'List Items', 'Video'],
      url: ['title', 'body', 'listItems']
    },
    { 
      name: 'Tab', 
      comp: 'tabs',
      isOpen: false, 
      links: ['Image', 'Text','Image', 'Image', 'Text','Image', 'Image', 'Text','Image'], 
      items: ['Tab Logo 1', 'Tab Heading 1', 'Tab Content 1', 'Tab Logo 2', 'Tab Heading 2', 'Tab Content 2', 'Tab Logo 3', 'Tab Heading 3', 'Tab Content 3'],
      url: [ '', '0', '', '', '1', '', '', '2', '' ]
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
      url: ['', 'sp1[0]', 'sp1[1]', 'sp2[0]', 'sp2[1]', 'sp3[0]', 'sp3[1]']
    },
    { 
      name: 'Testimonials', 
      comp: 'testimonials',
      isOpen: false, 
      links: ['Text', 'Text'], 
      items: ['Title', 'Comment', 'Designation', 'Company'],
      url: ['title']
    },
    { 
      name: 'Backing', 
      comp: 'backing',
      isOpen: false, 
      links: ['Text', 'Text', 'Text'], 
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
    let str = name + item;
    this.fieldForText = str.split(" ").join("");

    this.fieldClicked = name;
    this.elementClicked = item;

    if(link === 'Image'){
      this.textData=false;
      this.viewContainer.clear();
      this.viewContainer.createComponent(ImageComponent);
      this.updateData();
      return;
    }
    if(link === 'Video'){
      this.textData=false;
      this.viewContainer.clear();
      this.viewContainer.createComponent(VideoComponent);
      this.updateData();
      return;
    }
    else{
      this.viewContainer.clear();
      this.textData=true;
      return;
    }
  }

  receiveText(event: string) {
    this.textFromChild = event;

    this.textObject = { "Field": this.fieldForText, "Text": this.textFromChild }
    this.navbarData.Button.name = this.textFromChild;


    if (this.textObject) {
      console.log(this.textObject);
      this.updateData();
      this.textObjSent.emit(this.textObject);
      this.textObject = {"Field":'', "Text":''};
    }
  }

  updateData(){
    // console.log(this.existingData.components[this.fieldClicked][this.elementClicked]);
    this.existingData.components[this.fieldClicked][this.elementClicked] = this.textFromChild;
    // const id = this.existingData._id;

    const {_id, ...newData} = this.existingData.components;
    const body = {
      "components": newData
    };

    this.mainService.createData(body);
  }
}