import { Component } from '@angular/core';

import { environment } from '@env/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthenticationService } from '@app/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { TranslateService } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent {
  version: string | null = environment.version;
  email = '';
  password = '';

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _authService: AuthenticationService,
    private readonly _toast: HotToastService,
    private readonly _translate: TranslateService,
  ) {}

  login() {
    // Here You can call the login method from the AuthenticationService directly and pass the required parameters.
    // setting credentials and other logic will be handled in the AuthenticationService.
    this._authService
      .login({
        email: this.email,
        password: this.password,
      })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          if (res) {
            this._toast.success(this._translate.instant('Login successful'));
            this._router
              .navigate([this._route.snapshot.queryParams['redirect'] || '/dashboard'], { replaceUrl: true })
              .then(() => {
                console.log('Navigated to dashboard');
              });
          }
        },
        error: (error) => {
          this._toast.error(this._translate.instant('Invalid credentials'));
          console.error('Login error:', error);
        },
      });
  }
}
