import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';

import { CredentialsService } from '@app/auth';
import { Credentials } from '@core/entities';

export interface LoginContext {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterContext {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly _apiUrl = '/api/v1/auth';

  constructor(
    private readonly _http: HttpClient,
    private readonly _credentialsService: CredentialsService,
  ) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    return this._http
      .post<any>(`${this._apiUrl}/email/login`, {
        email: context.email,
        password: context.password,
      })
      .pipe(
        map((res) => {
          const credentials = new Credentials({
            token: res.token,
            refreshToken: res.refreshToken,
            expiresIn: res.tokenExpires,
            username: res.user.email,
            email: res.user.email,
            id: res.user.id,
            roles: [res.user.role?.name || 'user'],
            firstName: res.user.firstName,
            lastName: res.user.lastName,
          });
          this._credentialsService.setCredentials(credentials, context.remember);
          return credentials;
        }),
      );
  }

  /**
   * Registers a new user.
   * @param context The registration parameters.
   * @return True if successful.
   */
  register(context: RegisterContext): Observable<boolean> {
    return this._http
      .post<void>(`${this._apiUrl}/email/register`, {
        email: context.email,
        password: context.password,
        firstName: context.firstName,
        lastName: context.lastName,
      })
      .pipe(
        map(() => true),
        catchError((err) => throwError(() => err)),
      );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<any> {
    this._credentialsService.setCredentials();
    return this._http.post(`${this._apiUrl}/logout`, {}).pipe(
      map(() => true),
      catchError(() => {
        // Even if logout fails on server, clear local credentials
        return [true];
      }),
    );
  }
}
