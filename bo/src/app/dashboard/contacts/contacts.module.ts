import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
/* -------------------------- les modules partagés -------------------------- */
import { SharedModule } from "src/app/shared/shared.module";
/* ----------------------------- les composants ----------------------------- */
import { ContactsListeComponent } from "./contacts_liste/contacts_liste.component";
/* ------------------------------- les routes ------------------------------- */
const routes: Routes = [
  {
    path: "",
    component: ContactsListeComponent,
  },
  { path: "**", redirectTo: "", pathMatch: "full" }
];
@NgModule({
  declarations: [
    ContactsListeComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ContactsModule { }