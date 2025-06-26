import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MarquesComponent } from '../marques/marques.component';
import { ListeMarquesComponent } from './liste-marques/liste-marques.component';
import { FormulaireAjoutMarquesComponent } from './formulaire-ajout-marques/formulaire-ajout-marques.component';
import { FormulaireModificationMarquesComponent } from './formulaire-modification-marques/formulaire-modification-marques.component';
import { UploadImageMarquesComponent } from './upload-image-marques/upload-image-marques.component';
const router: Routes = [
  {
    path: '', component: MarquesComponent,
    children: [
      {
        path: '',
        redirectTo: 'liste_marque',
        pathMatch: 'full',
      },
      {
        path: 'liste_marque',
        component: ListeMarquesComponent
      },
      { path: '**', redirectTo: "liste_marque", pathMatch: 'full' }
    ]
  }
];


@NgModule({
  declarations: [
    MarquesComponent,
    ListeMarquesComponent,
    FormulaireAjoutMarquesComponent,
    FormulaireModificationMarquesComponent,
    UploadImageMarquesComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(router)
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MarquesModule { }
