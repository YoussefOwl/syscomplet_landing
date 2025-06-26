import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
/* -------------------------- les modules partagés -------------------------- */
import { SharedModule } from "src/app/shared/shared.module";
/* ----------------------------- les composants ----------------------------- */
import { ContenuListeComponent } from "./contenu_liste/contenu_liste.component";
import { ModifierAjouterContenuComponent } from "./contenu_update_add/contenu_update_add.component";
import { UploadImageComponent } from './upload-image/upload-image.component';
/* ------------------------------- les routes ------------------------------- */
const routes: Routes = [
  {
    path: "",
    component: ContenuListeComponent,
  },
  { path: "**", redirectTo: "", pathMatch: "full" }
];
@NgModule({
  declarations: [
    ContenuListeComponent,
    ModifierAjouterContenuComponent,
    UploadImageComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ContenusModule { }