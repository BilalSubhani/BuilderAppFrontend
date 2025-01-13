import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { MainService } from '../../main.service';

@Component({
  selector: 'app-backing',
  imports: [CommonModule],
  templateUrl: './backing.component.html',
  styleUrl: './backing.component.less'
})
export class BackingComponent {

  @Input() message: string = '';
  private subscription?: Subscription;
  constructor(
    private http: HttpClient,
    private mainService: MainService,
  ){}

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

    this.subscription = this.mainService.dataChange$.subscribe((hasChanged) => {
      if (hasChanged) {
        this.dataFunctions();
      }
    });
  }

  ngOnChannges(){
    if(this.message === 'backing' || this.message === 'startPowering'){
      // console.log(`${this.message}`);
      this.dataFunctions();
    }
    window.location.reload();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
