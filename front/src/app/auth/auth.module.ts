import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthRouting } from '@app/auth/auth.routing';
import { LoginComponent } from '@app/auth/login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { LanguageSelectorComponent } from '@app/i18n';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, AuthRouting, FormsModule, LanguageSelectorComponent, RouterModule],
  declarations: [LoginComponent, LogoutComponent, RegisterComponent],
})
export class AuthModule {}
