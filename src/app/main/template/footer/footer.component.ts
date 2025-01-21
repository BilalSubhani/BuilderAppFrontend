import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ImageComponent } from '../../image/image.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template-footer',
  imports: [CommonModule, ImageComponent, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.less'
})

export class FooterTemplateComponent {
  imageUrl: string = '';
  footerData: any;
  
  constructor(
    private http: HttpClient
  ){}

  dataFunction(){
    this.http.get<any>('http://localhost:3000/data/component/footer').subscribe(
      (res: any)=>{
        this.footerData= {...this.footerData, ...res.data};
      }, (err) =>{
        console.log(err);
      }
    );
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
    this.dataFunction();
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
}