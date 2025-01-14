import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MainService } from '../../main.service';

@Component({
  selector: 'app-template-whyburq',
  imports: [CommonModule],
  templateUrl: './whyburq.component.html',
  styleUrl: './whyburq.component.less'
})

export class WhyburqTemplateComponent {
  whyBurqData: any;
  benefitsData: any;
  imagePublicUrl: string[] = ['whyburq', 'sp1', 'sp2', 'sp3']
  imageUrl: string[] = [];
  private subscription?: Subscription;

  constructor(
    private http: HttpClient,
    private mainService: MainService,
  ) {}

  dataFunctions(): void{
    this.imagePublicUrl.forEach((p_id)=>{
      this.http.get<any>(`http://localhost:3000/media/images/${p_id}`).subscribe(
        (response: any) => {
          this.imageUrl.push(response.url);
        },
        (error) => {
          console.log(error);
        }
      );
    });

    this.http.get<any>("http://localhost:3000/data/component/whyBurq").subscribe((res)=>{
      this.whyBurqData = res.data;
    }, (err)=>{
      console.log(err);
    });

    this.http.get<any>("http://localhost:3000/data/component/sellingPoints").subscribe((res)=>{
      this.benefitsData = res.data;
    }, (err)=>{
      console.log(err);
    });
  }


  ngOnInit(){
    this.dataFunctions();

    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataFunctions();
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}