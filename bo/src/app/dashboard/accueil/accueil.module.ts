import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* -------------------------- les modules partagés -------------------------- */
import { SharedModule } from 'src/app//shared/shared.module';
import { ChipsModule } from 'primeng/chips';
/* ----------------------------- les composants ----------------------------- */
import { AccueilComponent } from './accueil.component';

const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AccueilComponent
  ],
  imports: [
    ChipsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA]
})

export class AccueilModule { }