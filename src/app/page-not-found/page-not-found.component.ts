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
  value: string = '';

  constructor(
    private router: Router, 
    private authService : AuthService
  ){

    if(this.authService.getToken())
      this.value = 'Home Page';
    else
      this.value = 'Login Page';
  }


  checkLoggedIn(){
    if(this.authService.getToken()){
      this.router.navigate(['/burq']);
    }
    else{
      this.router.navigate(['/']);
    }
  }
}
