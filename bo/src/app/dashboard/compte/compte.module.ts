import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* -------------------------- les modules partagés -------------------------- */
import { SharedModule } from 'src/app//shared/shared.module';
/* ----------------------------- les composants ----------------------------- */
import { CompteComponent } from './compte.component';

const routes: Routes = [
  { path: '', component: CompteComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    CompteComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA]
})

export class CompteModule { }