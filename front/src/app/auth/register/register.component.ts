import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/auth';
import { HotToastService } from '@ngxpert/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false,
})
export class RegisterComponent {
  email = '';
  password = '';
  firstName = '';
  lastName = '';

  constructor(
    private readonly _router: Router,
    private readonly _authService: AuthenticationService,
    private readonly _toast: HotToastService,
    private readonly _translate: TranslateService,
  ) {}

  register() {
    this._authService
      .register({
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
      })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          if (res) {
            this._toast.success(this._translate.instant('Registration successful'));
            this._router.navigate(['/login'], { replaceUrl: true });
          }
        },
        error: (error) => {
          this._toast.error(this._translate.instant('Registration failed'));
          console.error('Registration error:', error);
        },
      });
  }
}
