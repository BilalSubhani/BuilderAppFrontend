import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
  admins: any[] = [];
  users: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  @Input() userType: string = '';
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.error = null;
    this.dashboardService.getUsers().subscribe({
      next: (data) => {
        this.admins = data.filter(user => user.isAdmin);
        this.users = data.filter(user => !user.isAdmin);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch users.';
        this.isLoading = false;
        console.error('Error fetching users:', err);
      },
    });
  }

  toggleAdminStatus(userId: string, currentAdminStatus: number): void {
    this.dashboardService.toggleAdminStatus(userId, currentAdminStatus).subscribe({
      next: (response) => {
        if (response.message && response.message.includes('successful')) {
          this.fetchUsers();
        }
      },
      error: (err) => {
        this.error = 'Failed to update admin status.';
        console.error('Error updating admin status:', err);
      },
    });
  }
  

  deleteUser(userId: string): void {
    this.dashboardService.deleteUser(userId).subscribe({
      next: (response) => {
        if (response.message && response.message.includes("successful")) {
          this.fetchUsers();
        }
      },
      error: (err) => {
        this.error = 'Failed to delete user.';
        console.error('Error deleting user:', err);
      },
    });
  }
}
