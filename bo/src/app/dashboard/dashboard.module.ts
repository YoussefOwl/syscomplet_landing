import { NgModule, NO_ERRORS_SCHEMA, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { AuthGuard } from 'src/app/services/guard/auth.guard';
import { RolesGuard } from 'src/app/services/guard/autorised_roles.guard';
import { ScrollTopModule } from 'primeng/scrolltop';
/* ----------------------------- les composants ----------------------------- */
import { DashboardComponent } from './dashboard.component';
import { FooterComponent } from './structure/footer/footer.component';
import { NavbarComponent } from './structure/navbar/navbar.component';
import { SidebarComponent } from './structure/sidebar/sidebar.component';
import { GlobalErrorHandler } from 'src/app/error_checker';
/* -------------------------------------------------------------------------- */
/*                                 Les routes                                 */
/* -------------------------------------------------------------------------- */
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'accueil',
        pathMatch: 'full'
      },
      {
        path: 'accueil',
        canActivate: [AuthGuard],
        loadChildren: () => import('./accueil/accueil.module').then(g => g.AccueilModule)
      },
      {
        path: 'compte',
        canActivate: [AuthGuard],
        loadChildren: () => import('./compte/compte.module').then(g => g.CompteModule)
      },
      {
        path: 'configurations',
        canActivate: [AuthGuard, RolesGuard],
        data: { roles: 'can_access_configurations' },
        loadChildren: () => import('./configurations/configurations.module').then(g => g.ConfigurationsModule)
      },
      {
        path: 'contenus',
        canActivate: [AuthGuard, RolesGuard],
        data: { roles: 'can_access_contenus' },
        loadChildren: () => import('./contenus/contenus.module').then(g => g.ContenusModule)
      },
      {
        path: 'contacts',
        canActivate: [AuthGuard, RolesGuard],
        data: { roles: 'can_access_contacts' },
        loadChildren: () => import('./contacts/contacts.module').then(g => g.ContactsModule)
      },
      {
        path: 'partenaires',
        canActivate: [AuthGuard, RolesGuard],
        data: { roles: 'can_access_partenaires' },
        loadChildren: () => import('./partenaires/partenaires.module').then(g => g.PartenairesModule)
      },
      {
        path: 'newsletters',
        canActivate: [AuthGuard, RolesGuard],
        data: { roles: 'can_access_newsletters' },
        loadChildren: () => import('./newsletters/newsletters.module').then(g => g.NewslettersModule)
      },
      {
        path: 'fournisseurs',
        canActivate: [AuthGuard, RolesGuard],
        data: { roles: 'can_access_fournisseurs' },
        loadChildren: () => import('./fournisseur/fournisseur.module').then(g => g.FournisseurModule)
      },
      {
        path: 'articles',
        canActivate: [AuthGuard, RolesGuard],
        data: { roles: 'can_access_articles' },
        loadChildren: () => import('./articles/articles.module').then(g => g.ArticlesModule)
      },
      {
        path: 'marques',
        canActivate: [AuthGuard, RolesGuard],
        data: { roles: 'can_access_marques' },
        loadChildren: () => import('./marques/marques.module').then(g => g.MarquesModule)
      },
      { path: '**', redirectTo: 'accueil', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    ScrollTopModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ProgressBarModule,
    TooltipModule,
    SidebarModule,
    PanelModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]
})
export class DashboardModule {
}