import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ArticlesComponent } from '../articles/articles.component';
import { FormulaireAjoutArticleComponent } from './formulaire-ajout-article/formulaire-ajout-article.component';
import { ListeArticleComponent } from './liste-article/liste-article.component';
import { FormualireUpdateArticleComponent } from './formualire-update-article/formualire-update-article.component';
import { UploadImageArticleComponent } from './upload-image-article/upload-image-article.component';

const router: Routes = [
  {
    path: '', component: ArticlesComponent,
    children: [
      {
        path: '',
        redirectTo: 'liste_articles',
        pathMatch: 'full',
      },
      {
        path: 'liste_articles',
        component: ListeArticleComponent
      },
      { path: '**', redirectTo: "liste_articles", pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    ArticlesComponent,
    FormulaireAjoutArticleComponent,
    ListeArticleComponent,
    FormualireUpdateArticleComponent,
    UploadImageArticleComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(router)
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ArticlesModule { }
