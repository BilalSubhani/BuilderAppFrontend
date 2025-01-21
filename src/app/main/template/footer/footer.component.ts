import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ImageComponent } from '../../image/image.component';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-template-footer',
  imports: [CommonModule, ImageComponent, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.less'
})

export class FooterTemplateComponent {
  imageUrl: string = '';
  footerData: any;

  @Output() footerDataEvent: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(
    private http: HttpClient
  ){}

  dataFunction(): Observable<void> {
      return new Observable((observer) => {
        this.http.get<any>('http://localhost:3000/data/component/footer').subscribe(
          (res: any) => {
            this.footerData= {...this.footerData, ...res.data};
            
            observer.next();
            observer.complete();
          },
          (err) => {
            console.log('Error fetching features data:', err);
            observer.error(err);
          }
        );
      });
    }

  ngOnInit(){
    this.http.get<any>(`http://localhost:3000/media/images/footerLogo`).subscribe(
      (response: any) => {
        this.imageUrl = response.url;
      },
      (error) => {
        console.log(error);
      }
    );
    
    this.dataFunction().subscribe({
      next: () => {
        this.setExport();
      },
      error: (err) => {
        console.log('Error in dataFunction:', err);
      }
    });
  }

  publicID: string = '';
  change: boolean = false;

  changeLogo(index: any) {
    if (typeof index !== 'string') {
      this.publicID = "footerLogo";
      this.change = !this.change;
    } else {
      this.change = !this.change;
    }
  }

  setExport(){
    this.footerDataEvent.emit(this.footerData);
  }
}