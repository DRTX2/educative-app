import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/services/shell.service';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { PermissionGuard } from '@app/auth/guard/permission.guard';
import { ROLE } from '@app/auth/enums/roles.enum';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'tasks',
      loadComponent: () => import('./tasks/tasks.component').then((m) => m.TasksComponent),
    },
    {
      path: 'lessons',
      children: [
        { path: '', loadComponent: () => import('./lessons/lesson-list/lesson-list.component').then(m => m.LessonListComponent) },
        { path: ':id', loadComponent: () => import('./lessons/lesson-detail/lesson-detail.component').then(m => m.LessonDetailComponent) }
      ]
    },
    {
      path: 'feedback',
      loadComponent: () => import('./feedback/feedback-page.component').then((m) => m.FeedbackPageComponent),
    },
    {
      path: 'admin',
      loadComponent: () => import('./admin/admin-overview.component').then((m) => m.AdminOverviewComponent),
      canActivate: [PermissionGuard],
      data: {
        roles: [ROLE.ADMIN],
      },
    },
    {
      path: 'users',
      loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
    },

    // Fallback when no prior route is matched
    { path: '**', redirectTo: '', pathMatch: 'full' },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
