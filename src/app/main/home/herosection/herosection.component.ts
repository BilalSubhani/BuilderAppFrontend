import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { ToastrService } from 'ngx-toastr';
import { MainService } from '../../main.service';
import { Subscription } from 'rxjs';
import { io } from 'socket.io-client';


@Component({
  selector: 'app-herosection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './herosection.component.html',
  styleUrl: './herosection.component.less'
})
export class HerosectionComponent {
  @ViewChild('navbar', { static: false }) navbar!: ElementRef;
  @ViewChild('heroSection', { static: false }) heroSection!: ElementRef;
  @ViewChild('myBtn', { static: false }) myBtn!: ElementRef;
  @ViewChild('mySidenav') mySidenav!: ElementRef;
  objectKeys = Object.keys;

  private socket: any;
  messageReceived:string = '';

  dropdownSections = [
      { 
        name: 'Navbar', 
        comp: 'heroSection',
      },
      { 
        name: 'Hero', 
        comp: 'heroSection',
      },
      { 
        name: 'Features', 
        comp: 'features',
      },
      { 
        name: 'Provider',
        comp: 'provider', 
      },
      { 
        name: 'Tab', 
        comp: 'tabs',
      },
      { 
        name: 'Integrate', 
        comp: 'integrate',
  
      },
      { 
        name: 'Industries', 
        comp: 'industries',
      },
      { 
        name: 'Why Burq?', 
        comp: 'whyBurq'
      },
      { 
        name: 'Selling Points', 
        comp: 'whyBurq',
      },
      { 
        name: 'Testimonials', 
        comp: 'testimonials',
      },
      { 
        name: 'Backing', 
        comp: 'backing',
      },
      { 
        name: 'Powering', 
        comp: 'backing',
      },
      {
        name: 'Footer', 
        comp: 'footer',
      }
  ];

  imagePublicUrl: string[] = ['burq-logo'];
  imageUrl: string[] = [];
  videoUrl: string = '';
  public_id: string = '3steps';

  navbarData: any;
  heroSectionData: any;

  private subscription?: Subscription;

  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private mainService: MainService,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}

  dataController(){
    this.http.get<any>(`http://localhost:3000/media/videos/${this.public_id}`).subscribe(
      (response: any) => {
        this.videoUrl = response.url;
      },
      (error) => {
        this.toastr.error('Error fetching video', 'Error', {
          positionClass: 'toast-top-right',
          progressBar: true,
          progressAnimation: 'decreasing'
        });
      }
    );

    this.imagePublicUrl.forEach((p_id)=>{
      this.http.get<any>(`http://localhost:3000/media/images/${p_id}`).subscribe(
        (response: any) => {
          this.imageUrl.push(response.url);
        },
        (error) => {
          this.toastr.error('Error fetching video', 'Error', {
            positionClass: 'toast-top-right',
            progressBar: true,
            progressAnimation: 'decreasing'
          });
        }
      );
    })

    this.http.get<any>('http://localhost:3000/data/component/navbar').subscribe(
      (res: any)=>{
        this.navbarData={...this.navbarData, ...res.data};
      }, (err) =>{
        console.log(err);
      }
    );

    this.http.get<any>('http://localhost:3000/data/component/heroSection').subscribe(
      (res: any)=>{
        this.heroSectionData= {...this.heroSectionData, ...res.data};
      }, (err) =>{
        console.log(err);
      }
    );
    
    this.mainService.notifyDataChange(false);
  }

  ngOnInit() {
    this.dataController();

    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataController();
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if ('IntersectionObserver' in window) {
        const observerNavbar = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const action = entry.isIntersecting ? 'addClass' : 'removeClass';
            this.renderer[action](this.navbar.nativeElement, 'expand');
            
            const scrolled = entry.isIntersecting ? 'None' : 'Block';
            this.renderer.setStyle(this.myBtn.nativeElement, 'display', scrolled);
          });
        }, { threshold: 0.7 });

        observerNavbar.observe(this.heroSection.nativeElement);
      } else {
        console.warn('IntersectionObserver is not supported in this environment.');
      }
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
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

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  openNav() {
    this.mySidenav.nativeElement.style.width = '250px';
  }
  closeNav() {
    this.mySidenav.nativeElement.style.width = '0';
  }

  scrollTo(componentId: any) {
    this.closeNav();
    const childElement = document.getElementById(componentId);
     
    if (childElement) {
      childElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    else
      this.topFunction();
  }

  connectToSocket(): void {
    this.socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      // console.log('Connected to server with ID:', this.socket.id);
    });

    this.socket.on('handleChange', (data: any) => {
      // console.log('Message received from server:', data);
      this.messageReceived = data;
      this.implementation();
    });

    this.socket.on('connect_error', (err: any) => {
      console.error('Connection error:', err);
    });
  }

  implementation(){
      window.location.reload();
  }

}
