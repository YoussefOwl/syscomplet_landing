import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
/* -------------------------- les modules partagés -------------------------- */
import { SharedModule } from "src/app/shared/shared.module";
/* ----------------------------- les composants ----------------------------- */
import { AjouterPartenaireComponent } from "./partenaire_ajout_update/partenaire_ajout_update.component";
import { ImagePartenaireComponent } from "./partenaire_image/partenaire_image.component";
import { PartenaireListeComponent } from "./partenaire_liste/partenaire_liste.component";
/* -------------------------------- les routes -------------------------------- */
const routes: Routes = [
  {
    path: "",
    component: PartenaireListeComponent,
  },
  { path: "**", redirectTo: "", pathMatch: "full" },
];
@NgModule({
  declarations: [
    PartenaireListeComponent,
    AjouterPartenaireComponent,
    ImagePartenaireComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class PartenairesModule { }
