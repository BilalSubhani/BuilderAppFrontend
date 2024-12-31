import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.less'
})
export class PageNotFoundComponent {
  constructor(
    private router: Router, 
    private authService : AuthService
  ){}

  checkLoggedIn(){
    if(this.authService.getToken()){
      this.router.navigate(['/burq']);
    }
    else{
      this.router.navigate(['/']);
    }
  }
}
