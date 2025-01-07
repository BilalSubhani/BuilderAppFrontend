import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-backing',
  imports: [CommonModule],
  templateUrl: './backing.component.html',
  styleUrl: './backing.component.less'
})
export class BackingComponent {

  constructor(private http: HttpClient){}

  backingData: any;
  poweringData: any;

  dataFunctions(): void{
    this.http.get<any>("http://localhost:3000/data/component/backing").subscribe((res)=>{
      this.backingData = res.data;
    }, (err)=>{
      console.log(err);
    });

    this.http.get<any>("http://localhost:3000/data/component/startPowering").subscribe((res)=>{
      this.poweringData = res.data;
    }, (err)=>{
      console.log(err);
    });
  }

  ngOnInit(){
    this.dataFunctions();
  }
}
