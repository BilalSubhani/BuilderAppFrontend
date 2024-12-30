import { Component, OnInit } from '@angular/core';
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
  users: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    // console.log('called');
    this.isLoading = true;
    this.error = null;
    this.dashboardService.getUsers().subscribe({
      next: (data) => {
        this.users = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch users.';
        this.isLoading = false;
        console.error('Error fetching users:', err);
      },
    });
  }

  toggleAdminStatus(userId: string, isAdmin: number): void {
    // console.log(userId, isAdmin);
    this.dashboardService.toggleAdminStatus(userId, isAdmin).subscribe({
      next: (response) => {
        if (response.message && response.message.includes("successful")) {
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
