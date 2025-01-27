import { AuthService } from './../auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, DashboardComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.less',
})
export class AdminComponent {
  displayUsers: boolean = false;
  filters: string = '';
  userTypeArr = ['Admins', 'Users'];
  isDropdownOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.displayUsers = false;
  }

  toggleUsers(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  handleItemClick(userType: string) {
    this.filters = userType;
    this.displayUsers = true;
  }
}
