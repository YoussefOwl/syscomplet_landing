import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
/* -------------------------------------------------------------------------- */
/*                            les modules partagés                            */
/* -------------------------------------------------------------------------- */
import { SharedModule } from "src/app/shared/shared.module";
/* -------------------------------------------------------------------------- */
/*                               les composants                               */
/* -------------------------------------------------------------------------- */
import { ConfigurationsComponent } from './configurations.component';
import { RolesComponent } from "./roles/roles.component";
import { FormulaireAjoutComponent } from "./formulaire_ajout/formulaire-ajout.component";
import { FormulaireParametrageomponent } from "./formulaire_parametrage/formulaire-parametrage.component";
import { ListeUtilisateurComponent } from "./liste_utlisateurs/liste_utlisateurs.component";
import { LogsComponent } from "./logs/logs.component";
import { VillesComponent } from "./villes/villes.component";

const routes: Routes = [
  { path: "", component: ConfigurationsComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  declarations: [
    ConfigurationsComponent,
    ListeUtilisateurComponent,
    FormulaireParametrageomponent,
    FormulaireAjoutComponent,
    RolesComponent,
    LogsComponent,
    VillesComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA]
})

export class ConfigurationsModule { }