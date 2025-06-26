import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MarqueService } from 'src/app/services/marque/marque.service';
import { GeneralService } from 'src/app/services/services';

@Component({
  selector: 'app-liste-marques',
  templateUrl: './liste-marques.component.html',
})
export class ListeMarquesComponent {
  is_loading: boolean = true;

  /* ------------------------------ Global Variables ----------------------------- */
  afficher_marque: Subscription;
  supprimer_marque: Subscription;

  /* ------------------------ Display Variables ----------------------- */
  skip: number = 0;
  take: number = 10;
  order: string = 'asc';
  colone: string = 'libelle_marque';
  totalRecords: number = 0;
  liste_marques: any[] = [];
  formulaireRecherche: FormGroup;

  headerProps: any[] = [
    { burgerMenu: true, style: 'width: 5rem !important' },
    { label: 'Image' },
    { key: 'libelle_marque', label: 'Marque', sort: true },
    { key: 'description', label: 'Description', sort: true },
    { label: 'Actions', style: 'width: 15rem !important' },
  ];

  /* ----------------- Popup Variables for Add or Update ----------------- */
  headerInfo: string;
  if_show_ajouter: boolean = false;
  if_show_update: boolean = false;
  if_show_image: boolean = false;
  dataItem: any;

  constructor(
    private marqueService: MarqueService,
    protected generalService: GeneralService
  ) {
    this.formulaireRecherche = new FormGroup({
      libelle_marque: new FormControl(null),
      description: new FormControl(null),
    });
  }

  ngOnInit() {
    this.AfficherMarque();
  }

  rechercher() {
    this.skip = 0;
    this.take = 10;
    this.AfficherMarque();
  }

  clearSearch() {
    this.formulaireRecherche.reset();
    setTimeout(() => {
      this.rechercher();
    }, 100);
  }

  AfficherMarque() {
    this.is_loading = true;
    this.afficher_marque = this.marqueService
      .AfficherMarque({
        skip: this.skip,
        take: this.take,
        order: this.order,
        colone: this.colone,
        ...this.formulaireRecherche.value,
      })
      .subscribe({
        next: (res: any) => {
          switch (res?.api_message) {
            case 'success':
              this.liste_marques = res?.data || [];
              this.totalRecords = res?.totalRecords || 0;
              break;
            default:
              this.generalService.errorSwal(
                'Oups, quelque chose a mal tourné au niveau du serveur !'
              );
              break;
          }
        },
        complete: () => (this.is_loading = false),
      });
  }

  paginate(event: any) {
    this.take = event?.rows;
    this.skip = event?.first;
    setTimeout(() => {
      this.AfficherMarque();
    }, 10);
  }

  sort(event: any) {
    this.colone = event?.field;
    this.order = event?.order == -1 ? 'desc' : 'asc';
    setTimeout(() => {
      this.AfficherMarque();
    }, 10);
  }

  /* ---------------------------------- Add --------------------------------- */
  showFormulaireAjout() {
    Promise.resolve()
      .then(() => {
        this.headerInfo = "Formulaire d'ajout";
        this.dataItem = null;
      })
      .then(() => (this.if_show_ajouter = true));
  }

  /* --------------------------------- Update --------------------------------- */
  showFormulaireUpdate(dataItem: any) {
    Promise.resolve()
      .then(() => {
        this.headerInfo = 'Formulaire de modification';
        this.headerInfo =
          'Modification des informations de la marque : ' +
          dataItem?.libelle_marque;
        this.dataItem = dataItem;
      })
      .then(() => (this.if_show_update = true));
  }

  /* --------------------------------- Delete --------------------------------- */
  onDelete(dataItem: any) {
    this.generalService
      .sweetAlert2(
        'Voulez-vous supprimer cet marque ?',
        null,
        'confirm',
        'question'
      )
      .then((res: any) => {
        if (res?.isConfirmed) {
          this.SupprimerMarque(dataItem?._id);
        }
      });
  }

  SupprimerMarque(id: any) {
    this.is_loading = true;
    this.supprimer_marque = this.marqueService
      .SupprimerMarque({ _id: id })
      .subscribe({
        next: (res: any) => {
          switch (res?.api_message) {
            case 'success':
              this.generalService
                .sweetAlert2(
                  'Marque supprimée avec succès',
                  null,
                  'simple',
                  'success'
                )
                .then(() => this.AfficherMarque());
              break;
            case 'error_delete':
              this.generalService
                .sweetAlert2(res?.title, null, 'simple', 'error', 'noTime')
                .then(() => this.AfficherMarque());
              break;
            default:
              this.generalService.errorSwal(
                'Oups, quelque chose a mal tourné !'
              );
              break;
          }
        },
        complete: () => {
          this.is_loading = false;
        },
      });
  }

  /* --------------------------------- Upload --------------------------------- */
  showImage(dataItem: any) {
    Promise.resolve()
      .then(() => {
        this.dataItem = dataItem;
        this.headerInfo = `Image de : ${dataItem?.libelle_marque}`;
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
      .then(() => this.AfficherMarque());
  }

  ngOnDestroy() {
    this.afficher_marque?.unsubscribe();
    this.supprimer_marque?.unsubscribe();
  }
}
