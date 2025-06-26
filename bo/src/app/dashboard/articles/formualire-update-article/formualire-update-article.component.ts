import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ArticleService } from 'src/app/services/articles/article.service';
import { GeneralService } from 'src/app/services/services';

@Component({
  selector: 'app-formualire-update-article',
  templateUrl: './formualire-update-article.component.html'
})
export class FormualireUpdateArticleComponent implements OnInit {
  @Input('dataItem') dataItem: any;
  @Output("FermerPopUp") FermerPopUp = new EventEmitter<boolean>();
  is_loading: boolean = false;

  /* ------------------------------ Subscriptions ----------------------------- */
  Modifier: Subscription;

  /* ---------------------------------- Forms --------------------------------- */
  Formulaire: FormGroup;

  constructor(
    public generalService: GeneralService,
    private articleService: ArticleService
  ) {
    this.Formulaire = new FormGroup({
      _id: new FormControl(null, Validators.required),
      libelle_article: new FormControl(null, Validators.required),
      description: new FormControl(null),
    });
  }

  ngOnInit() {
    this.iniData();
  }

  iniData() {
    Object.keys(this.Formulaire.value).forEach((element: string) => {
      this.Formulaire.get(element).setValue(this.dataItem?.[element] || null);
    });
  }

  onSubmit() {
    if (this.Formulaire.valid) {
      this.ModifierArticle();
    } else {
      this.generalService.sweetAlert2("Veuillez remplir tous les champs obligatoires", null, 'simple', 'error');
    }
  }

  ModifierArticle() {
    this.is_loading = true;
    this.Modifier = this.articleService.ModifierArticle(this.Formulaire.value)
      .subscribe({
        next: (res: any) => {
          switch (res?.api_message) {
            case "success":
              this.generalService
                .sweetAlert2('Article modifié avec succès', null, 'simple', 'success')
                .then(() => this.ClosePopUp(false));
              break;
            case "error_update":
              this.generalService.sweetAlert2(res?.title, null, 'simple', 'error', 'noTime');
              break;
            case "erreur_de_parametres":
              this.generalService.errorSwal("Erreur de paramètres !");
              break;
            case "error":
              this.generalService.errorSwal("Oups, quelque chose a mal tourné !");
              break;
          }
        },
        complete: () => this.is_loading = false
      });
  }

  /* ---------------------------------- Close --------------------------------- */
  ClosePopUp(if_show_confirm: boolean = true) {
    if (if_show_confirm) {
      this.generalService.sweetAlert2(
        'Confirmation',
        "Êtes-vous certain(e) de vouloir fermer le formulaire ?",
        'confirm',
        'question'
      ).then((res: any) => {
        if (res?.isConfirmed) this.FermerPopUp.emit();
      });
    } else {
      this.FermerPopUp.emit();
    }
  }

  ngOnDestroy() {
    this.Modifier?.unsubscribe();
  }
}
