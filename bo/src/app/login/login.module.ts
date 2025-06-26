import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* -------------------------- les modules partagés -------------------------- */
import { SharedModule } from '../shared/shared.module';
/* ----------------------------- les composants ----------------------------- */
import { LoginComponent } from './login.component';
const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LoginModule { }