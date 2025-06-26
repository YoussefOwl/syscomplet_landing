import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ArticleService } from 'src/app/services/articles/article.service';
import { GeneralService } from 'src/app/services/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-formulaire-ajout-article',
  templateUrl: './formulaire-ajout-article.component.html'
})
export class FormulaireAjoutArticleComponent {
  @Output("FermerPopUp") FermerPopUp = new EventEmitter();
  is_loading: boolean = false;

  /* ------------------------------ Subscriptions ----------------------------- */
  Ajouter: Subscription;

  /* ---------------------------------- Forms --------------------------------- */
  FormulaireAjout: FormGroup;
  max_val_accepted: number = 10000000; // 10 MB
  accept_format: string = environment.liste_multimedias_type
    .filter((res: any) => [1].includes(res.value))
    .map(item => item.allowed)
    .join(',');

  /* ---------------------------------- Steps --------------------------------- */
  steps: MenuItem[] = [
    { label: 'Informations générales' },
    { label: "Image d'article" },
  ];
  activeStep: number = 0;

  constructor(
    private articleService: ArticleService,
    protected generalService: GeneralService
  ) {
    this.FormulaireAjout = new FormGroup({
      libelle_article: new FormControl(null, Validators.required),
      description: new FormControl(null),
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Upload                                   */
  /* -------------------------------------------------------------------------- */
  handleDataAndFile(copie_multimedia: any) {
    copie_multimedia = copie_multimedia?.currentFiles;
    let formData = new FormData();
    if (copie_multimedia?.length > 0) {
      if (copie_multimedia[0].size > this.max_val_accepted) {
        this.generalService.sweetAlert2(
          "Le fichier est volumineux",
          "Le fichier est volumineux (" + (Number(copie_multimedia[0].size) / this.max_val_accepted).toFixed(2) + " Mo), le maximum est 10 Mo",
          'simple',
          'error',
          null,
          1
        );
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(copie_multimedia[0]); // Convert file to BASE64
        reader.onload = () => {
          Promise.resolve()
            .then(() => {
              formData.append('libelle_article', this.FormulaireAjout.value?.libelle_article);
              formData.append('description', this.FormulaireAjout.value?.description);
              formData.append('copie_multimedia', String(reader?.result)); // Image in binary
              formData.append('file_extension', copie_multimedia[0].name.split('.').pop());
            })
            .then(() => this.AjouterArticle(formData));
        };
      }
    } else {
      this.generalService.errorSwal("Formulaire invalide !");
    }
  }

  AjouterArticle(data: any) {
    this.is_loading = true;
    this.Ajouter = this.articleService.AjouterArticle(data)
      .subscribe({
        next: (res: any) => {
          switch (res?.api_message) {
            case "success":
              this.generalService
                .sweetAlert2('Article ajouté avec succès', null, 'simple', 'success')
                .then(() => this.ClosePopUp(false));
              break;
            case "error_ajout":
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
    this.Ajouter?.unsubscribe();
  }
}
