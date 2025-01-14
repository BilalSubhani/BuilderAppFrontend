import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MainService } from '../../main.service';

@Component({
  selector: 'app-template-integrate',
  templateUrl: './integrate.component.html',
  styleUrls: ['./integrate.component.less'],
  imports:[CommonModule]
})
export class IntegrateTemplateComponent {

  integrateData: any;
  imageUrl: string = '';
  private subscription?: Subscription;

  constructor(
    private http: HttpClient,
    private mainService: MainService,
  ) {}

  dataController(){
    this.http.get<any>(`http://localhost:3000/media/images/lines`).subscribe(
      (response: any) => {
        this.imageUrl = response.url;
      },
      (error) => {
        console.log(error);
      }
    );
    
    this.http.get<any>('http://localhost:3000/data/component/integrate').subscribe(
      (res)=>{
        this.integrateData=res.data;
      },
      (err)=>{
        console.log(err);
      });
  }

  ngOnInit(){
    this.dataController();

    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataController();
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
