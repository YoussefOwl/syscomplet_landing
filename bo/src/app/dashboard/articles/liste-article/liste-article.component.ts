import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ArticleService } from 'src/app/services/articles/article.service';
import { GeneralService } from 'src/app/services/services';

@Component({
  selector: 'app-liste-article',
  templateUrl: './liste-article.component.html'
})
export class ListeArticleComponent implements OnInit, OnDestroy {
  is_loading: boolean = true;

  /* ------------------------------ Global Variables ----------------------------- */
  afficher_articles: Subscription;
  supprimer_article: Subscription;

  /* ------------------------ Display Variables ----------------------- */
  skip: number = 0;
  take: number = 10;
  order: string = "asc";
  colone: string = "libelle_article";
  totalRecords: number = 0;
  liste_articles: any[] = [];
  formulaireRecherche: FormGroup;

  headerProps: any[] = [
    { burgerMenu: true, style: "width: 5rem !important" },
    { label: 'Image' },
    { key: 'libelle_article', label: 'Article', sort: true },
    { key: 'description', label: 'Description', sort: true },
    { label: 'Actions', style: "width: 15rem !important" }
  ];

  /* ----------------- Popup Variables for Add or Update ----------------- */
  headerInfo: string;
  if_show_ajouter: boolean = false;
  if_show_update: boolean = false;
  if_show_image: boolean = false;
  dataItem: any;

  constructor(
    private articleService: ArticleService,
    protected generalService: GeneralService
  ) {
    this.formulaireRecherche = new FormGroup({
      libelle_article: new FormControl(null),
      description: new FormControl(null)
    });
  }

  ngOnInit() {
    this.AfficherArticle();
  }

  rechercher() {
    this.skip = 0;
    this.take = 10;
    this.AfficherArticle();
  }

  clearSearch() {
    this.formulaireRecherche.reset();
    setTimeout(() => {
      this.rechercher();
    }, 100);
  }

  AfficherArticle() {
    this.is_loading = true;
    this.afficher_articles = this.articleService.AfficherArticle({
      skip: this.skip,
      take: this.take,
      order: this.order,
      colone: this.colone,
      ...this.formulaireRecherche.value
    })
    .subscribe({
      next: (res: any) => {
        switch (res?.api_message) {
          case "success":
            this.liste_articles = res?.data || [];
            this.totalRecords = res?.totalRecords || 0;
            break;
          default:
            this.generalService.errorSwal("Oups, quelque chose a mal tourné au niveau du serveur !");
            break;
        }
      },
      complete: () => this.is_loading = false
    });
  }

  paginate(event: any) {
    this.take = event?.rows;
    this.skip = event?.first;
    setTimeout(() => {
      this.AfficherArticle();
    }, 10);
  }

  sort(event: any) {
    this.colone = event?.field;
    this.order = (event?.order == -1) ? "desc" : "asc";
    setTimeout(() => {
      this.AfficherArticle();
    }, 10);
  }

  /* ---------------------------------- Add --------------------------------- */
  showFormulaireAjout() {
    Promise.resolve()
    .then(() => {
      this.headerInfo = "Formulaire d'ajout";
      this.dataItem = null;
    })
    .then(() => this.if_show_ajouter = true);
  }

  /* --------------------------------- Update --------------------------------- */
  showFormulaireUpdate(dataItem: any) {
    Promise.resolve()
    .then(() => {
      this.headerInfo = "Formulaire de modification";
      this.headerInfo = "Modification des informations de l'article : " + dataItem?.libelle_article;
      this.dataItem = dataItem;
    })
    .then(() => this.if_show_update = true);
  }

  /* --------------------------------- Delete --------------------------------- */
  onDelete(dataItem: any) {
    this.generalService.sweetAlert2("Voulez-vous supprimer cet article ?", null, "confirm", "question")
    .then((res: any) => {
      if (res?.isConfirmed) {
        this.SupprimerArticle(dataItem?._id);
      }
    });
  }

  SupprimerArticle(id: any) {
    this.is_loading = true;
    this.supprimer_article = this.articleService.SupprimerArticle({ _id: id })
    .subscribe({
      next: (res: any) => {
        switch (res?.api_message) {
          case "success":
            this.generalService.sweetAlert2('Article supprimé avec succès', null, 'simple', 'success')
            .then(() => this.AfficherArticle());
            break;
          case 'error_delete':
            this.generalService.sweetAlert2(res?.title, null, 'simple', 'error', 'noTime')
            .then(() => this.AfficherArticle());
            break;
          default:
            this.generalService.errorSwal("Oups, quelque chose a mal tourné !");
            break;
        }
      },
      complete: () => {
        this.is_loading = false;
      }
    });
  }

  /* --------------------------------- Upload --------------------------------- */
  showImage(dataItem: any) {
    Promise.resolve()
    .then(() => {
      this.dataItem = dataItem;
      this.headerInfo = `Image de : ${dataItem?.libelle_article}`;
    })
    .then(() => {
      this.if_show_image = true;
    });
  }

  /* ---------------------------------- Close --------------------------------- */
  closeFormulaire() {
    Promise.resolve()
    .then(() => {
      this.if_show_update = false;
      this.if_show_ajouter = false;
      this.if_show_image = false;
      this.dataItem = null;
    })
    .then(() => this.AfficherArticle());
  }

  ngOnDestroy() {
    this.afficher_articles?.unsubscribe();
    this.supprimer_article?.unsubscribe();
  }
}
