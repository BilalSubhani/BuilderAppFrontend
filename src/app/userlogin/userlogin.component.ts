import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from './userlogin.service';
import { AuthService } from '../auth.service'; 
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  SESSION_TIMEOUT = 60 * 60 * 1000;
  timeoutId: any;

  @ViewChild('loginTab') loginTab!: ElementRef;
  @ViewChild('signupTab') signupTab!: ElementRef;
  @ViewChild('loginForm') loginForm!: ElementRef;
  @ViewChild('signupForm') signupForm!: ElementRef;

  constructor(
    private userService: UserService, 
    private authService: AuthService,
    private router: Router, 
    private toastr: ToastrService
  ) {}

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
    return input.replace(/[^a-zA-Z0-9 ]/g, '');
  }

  inputValues(input: string): string {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
  }

  onSubmitLogin() {
    const sanitizedEmail = this.inputValues(this.email);
    const sanitizedPassword = this.inputValues(this.password);

    this.userService.loginUser({ email: sanitizedEmail, password: sanitizedPassword }).subscribe(
      (jwtToken) => {
        if (jwtToken) {
          localStorage.setItem("token", jwtToken.token);

          this.userService.getStatus(localStorage.getItem("token")).subscribe(
            (data) => {
              const adminStatus = data._doc.isAdmin;
              this.authService.setAdminStatus(adminStatus);
              
              if (adminStatus) {
                this.toastr.success(`${data._doc.fname}, Welcome to the Dashboard`, 'Successful', {
                  positionClass: 'toast-top-right',
                  progressBar: true,
                  progressAnimation: 'increasing'
                });
                this.startSessionTimeout();
                this.router.navigate(['/admin-dashboard']);
              } else {
                this.toastr.success(`${data._doc.fname}, Welcome to Burq`, 'Successful', {
                  positionClass: 'toast-top-right',
                  progressBar: true,
                  progressAnimation: 'increasing'
                });
                this.startSessionTimeout();
                this.router.navigate(['/burq']);
              }
            },
            (error) => {
              this.toastr.error('Failed to retrieve user status', 'Error!', {
                positionClass: 'toast-top-right',
                progressBar: true,
                progressAnimation: 'decreasing'
              });
            }
          );
        }
      },
      (error) => {
        this.toastr.error('Login failed', 'Error!', {
          positionClass: 'toast-top-right',
          progressBar: true,
          progressAnimation: 'decreasing'
        });
      }
    );
  }

  onSubmitSignUp() {
    const sanitizedFirstName = this.sanitizeInput(this.firstName);
    const sanitizedLastName = this.sanitizeInput(this.lastName);
    const sanitizedEmailSignUp = this.inputValues(this.emailSignUp);
    const sanitizedPasswordSignUp = this.inputValues(this.passwordSignUp);

    const newUser = {
      fname: sanitizedFirstName,
      lname: sanitizedLastName,
      email: sanitizedEmailSignUp,
      password: sanitizedPasswordSignUp,
      isAdmin: 0
    };

    const user = this.users.find(user => user.email === sanitizedEmailSignUp);
    if (!user) {
      this.userService.createUser(newUser).subscribe((res) => {
        this.toastr.success(`${newUser.fname}, Registered Successfully! 🥳`, 'Please use your credentials to login', {
          positionClass: 'toast-top-right',
          progressBar: true,
          progressAnimation: 'increasing'
        });

        this.emailSignUp = '';
        this.passwordSignUp = '';
        this.firstName = '';
        this.lastName = '';

        this.router.navigate(['/']);
        this.setActiveTab('login');
      }, (error) => {
        this.toastr.error('Invalid credentials', 'Error!', {
          positionClass: 'toast-top-right',
          progressBar: true,
          progressAnimation: 'decreasing'
        });
      });
    } else {
      this.toastr.warning('Redirected to login page.', 'Email already registered', {
        positionClass: 'toast-top-right',
        progressBar: true,
        progressAnimation: 'decreasing'
      });
      this.setActiveTab('login');
    }
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


  startSessionTimeout() {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/']);
    }, this.SESSION_TIMEOUT);
  }
}