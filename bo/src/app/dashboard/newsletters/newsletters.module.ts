import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
/* -------------------------- les modules partagés -------------------------- */
import { SharedModule } from "src/app/shared/shared.module";
/* ----------------------------- les composants ----------------------------- */
import { NewslettersListeComponent } from "./newsletters_liste/newsletters_liste.component";
/* ------------------------------- les routes ------------------------------- */
const routes: Routes = [
  {
    path: "",
    component: NewslettersListeComponent,
  },
  { path: "**", redirectTo: "", pathMatch: "full" }
];
@NgModule({
  declarations: [
    NewslettersListeComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class NewslettersModule { }