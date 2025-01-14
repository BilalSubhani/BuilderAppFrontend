import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MainService } from '../../main.service';

@Component({
  selector: 'app-template-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.less'
})
export class FeaturesTemplateComponent {
  
  imagePublicUrl: string[] = ['lines', 'featureTile1', 'featureTile2', 'featureTile3'];
  imageUrl: string[] = [];
  featuresData: any;

  private subscription?: Subscription;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private mainService: MainService
  ){}

  dataController(){
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
    });

    this.http.get<any>('http://localhost:3000/data/component/features').subscribe(
      (res: any)=>{
        this.featuresData=res.data;
      }, (err) =>{
      }
    );

    this.mainService.notifyDataChange(false);
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
