import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NetworkService } from '@core/services/network/network.service';
import { CredentialsService } from '@app/auth';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {
  menuHidden = true;
  currentTitle = 'Centro de aprendizaje';

  private readonly titles: Record<string, string> = {
    dashboard: 'Centro de aprendizaje',
    tasks: 'Misiones y tareas',
    lessons: 'Rutas de aprendizaje',
    feedback: 'Voz de la comunidad',
    admin: 'Docentes y administración',
    users: 'Gestión del equipo',
    login: 'Acceso',
  };

  constructor(
    private readonly router: Router,
    public readonly network: NetworkService,
    public readonly credentialsService: CredentialsService,
  ) {
    this.updateCurrentTitle(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateCurrentTitle((event as NavigationEnd).urlAfterRedirects);
      });
  }

  private updateCurrentTitle(url: string): void {
    const segment = url.split('/').filter(Boolean)[0] || 'dashboard';
    this.currentTitle = this.titles[segment] || 'Semilla Rural';
  }

  get learnerName(): string {
    const credentials = this.credentialsService.credentials;
    return credentials?.firstName || credentials?.username || 'Cuenta activa';
  }
}
