import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminUser {
  id: number;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  provider: string;
  createdAt: string;
  role?: {
    id: number;
    name?: string;
  } | null;
  status?: {
    id: number;
    name?: string;
  } | null;
}

interface UsersResponse {
  data: AdminUser[];
  hasNextPage: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminUsersService {
  private readonly apiUrl = '/api/v1/users';

  constructor(private readonly http: HttpClient) {}

  getUsers(page = 1, limit = 20): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }
}
