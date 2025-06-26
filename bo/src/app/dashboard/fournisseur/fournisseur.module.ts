import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FournisseurComponent } from '../fournisseur/fournisseur.component';
import { AjoutFournisseurComponent } from './ajout-fournisseur/ajout-fournisseur.component';
import { RouterModule, Routes } from '@angular/router';
import { ListeFournisseurComponent } from './liste-fournisseur/liste-fournisseur.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { UpdateFournisseurComponent } from './update-fournisseur/update-fournisseur.component';

const router: Routes = [
  {
    path: '', component: FournisseurComponent,
    children: [
      {
        path: '',
        redirectTo: 'liste_fournisseur',
        pathMatch: 'full',
      },
      {
        path: 'liste_fournisseur',
        component: ListeFournisseurComponent
      },
      { path: '**', redirectTo: "liste_fournisseur", pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    FournisseurComponent,
    AjoutFournisseurComponent,
    ListeFournisseurComponent,
    UploadImageComponent,
    UpdateFournisseurComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(router)
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class FournisseurModule { }