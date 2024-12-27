import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from './userlogin.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.less']
})
export class UserListComponent implements OnInit, AfterViewInit {
  users: any[] = [];
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  emailSignUp: string = '';
  passwordSignUp: string = '';
  activeTab: 'login' | 'signup' = 'login';

  @ViewChild('loginTab') loginTab!: ElementRef;
  @ViewChild('signupTab') signupTab!: ElementRef;
  @ViewChild('loginForm') loginForm!: ElementRef;
  @ViewChild('signupForm') signupForm!: ElementRef;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  ngAfterViewInit() {
    this.loginTab.nativeElement.addEventListener('click', () => {
      this.setActiveTab('login');
    });

    this.signupTab.nativeElement.addEventListener('click', () => {
      this.setActiveTab('signup');
    });
  }

  sanitizeInput(input: string): string {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
  }

  onSubmitLogin() {
    const sanitizedEmail = this.sanitizeInput(this.email);
    const sanitizedPassword = this.sanitizeInput(this.password);
    const user = this.users.find(user => user.email === sanitizedEmail && user.password === sanitizedPassword);
    if (user) {
      if (user.isAdmin) {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
    } else {
      alert('Invalid credentials');
    }
  }

  onSubmitSignUp() {
    const sanitizedFirstName = this.sanitizeInput(this.firstName);
    const sanitizedLastName = this.sanitizeInput(this.lastName);
    const sanitizedEmailSignUp = this.sanitizeInput(this.emailSignUp);
    const sanitizedPasswordSignUp = this.sanitizeInput(this.passwordSignUp);

    const newUser = {
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      email: sanitizedEmailSignUp,
      password: sanitizedPasswordSignUp,
      isAdmin: 0
    };
    // this.userService.addUser(newUser).subscribe(() => {
    //   alert('User registered successfully');
    //   this.emailSignUp = '';
    //   this.passwordSignUp = '';
    //   this.firstName = '';
    //   this.lastName = '';
    // });
  }

  setActiveTab(tab: 'login' | 'signup') {
    this.activeTab = tab;
    if (tab === 'login') {
      this.loginTab.nativeElement.classList.add('active');
      this.signupTab.nativeElement.classList.remove('active');
      this.loginForm.nativeElement.classList.add('active');
      this.signupForm.nativeElement.classList.remove('active');
    } else {
      this.signupTab.nativeElement.classList.add('active');
      this.loginTab.nativeElement.classList.remove('active');
      this.signupForm.nativeElement.classList.add('active');
      this.loginForm.nativeElement.classList.remove('active');
    }
  }
}