import { Component, OnInit } from '@angular/core';
import { AdminUser, AdminUsersService } from '../services/admin-users.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: false,
})
export class ListComponent implements OnInit {
  users: AdminUser[] = [];
  isLoading = true;
  search = '';

  constructor(private readonly adminUsersService: AdminUsersService) {}

  ngOnInit(): void {
    this.adminUsersService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      },
    });
  }

  filteredUsers(): AdminUser[] {
    const term = this.search.trim().toLowerCase();

    if (!term) {
      return this.users;
    }

    return this.users.filter((user) => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();
      return fullName.includes(term) || (user.email || '').toLowerCase().includes(term);
    });
  }

  getFullName(user: AdminUser): string {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Sin nombre';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
