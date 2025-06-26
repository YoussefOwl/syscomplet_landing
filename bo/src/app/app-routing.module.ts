import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorHandler } from '@angular/core';
import { NotauthGuard } from './services/guard/notauth.guard';
import { GlobalErrorHandler } from './error_checker';
import { AuthGuard } from './services/guard/auth.guard';
/* -------------------------------------------------------------------------- */
/*                            Le routing principale                           */
/* -------------------------------------------------------------------------- */
const routes: Routes = [
  {
    path: 'login',
    canActivate: [NotauthGuard],
    loadChildren: () => import('./login/login.module').then(g => g.LoginModule)
  },
  /* --------------- Le Dashbord lors d'une ouverture de session --------------- */
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(g => g.DashboardModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { scrollPositionRestoration: 'enabled', enableTracing: false }
    )
  ],
  exports: [RouterModule],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]
})
export class AppRoutingModule { }