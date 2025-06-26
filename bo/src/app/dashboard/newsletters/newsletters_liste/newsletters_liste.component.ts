import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { GeneralService, NewslettersService } from 'src/app/services/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newsletters-liste',
  templateUrl: './newsletters_liste.component.html',
})
export class NewslettersListeComponent implements OnInit {
  /* ------------------------------ Les variables globales ----------------------------- */
  is_loading: boolean = true;
  afficher: Subscription;
  Afficher_excel: Subscription;
  Supprimer: Subscription;
  /* ------------------------ les variables d'affichage ----------------------- */
  skip: any = 0;
  take: any = 10;
  order: any = 'desc';
  colone: any = 'email_newsletter';
  totalRecords: any = 0;
  liste_newsletters: any[] = [];
  FormmulaireRecherche: FormGroup;

  constructor(
    public generalService: GeneralService,
    private newsletters_service: NewslettersService
  ) {
    /* ---------------------- Initialisation du formulaire ---------------------- */
    this.FormmulaireRecherche = new FormGroup({
      email_newsletter: new FormControl(null),
      adresse_ip: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.AfficherNewslettersAdmins();
  }

  /* -------------------------------------------------------------------------- */
  /*                       Les fonctions pour l'affichage                       */
  /* -------------------------------------------------------------------------- */

  ClearSearch() {
    this.FormmulaireRecherche.reset();
    this.Rechercher();
  }

  Rechercher() {
    this.ContinueSerach();
  }

  ContinueSerach() {
    this.skip = 0;
    this.take = 10;
    setTimeout(() => {
      this.AfficherNewslettersAdmins();
    }, 100);
  }

  AfficherNewslettersAdmins() {
    this.is_loading = true;
    let body: any = {
      colone: this.colone,
      order: this.order,
      skip: this.skip,
      take: this.take,
      ...this.FormmulaireRecherche.value
    };
    this.afficher = this.newsletters_service
      .AfficherNewslettersAdmins(body)
      .subscribe(
        (r: any) => {
          if (r?.['api_message'] == 'success') {
            this.liste_newsletters = r.hasOwnProperty('Data')
              ? r?.['Data']
              : [];
            this.totalRecords = r.hasOwnProperty('totalRecords')
              ? r?.['totalRecords']
              : 0;
            setTimeout(() => { this.is_loading = false; }, 500);
          }
          else {
            this.generalService.errorSwal('Oups quelque chose a mal tourné ...');
            this.is_loading = false;
          }
        },
        () => {
          this.is_loading = false;
        }
      );
  }

  paginate(event: any) {
    this.take = event?.rows;
    this.skip = event?.first;
    setTimeout(() => {
      this.AfficherNewslettersAdmins();
    }, 100);
  }

  Sort(event: any) {
    this.colone = event?.field;
    this.order = event?.order == -1 ? 'desc' : 'asc';
    setTimeout(() => {
      this.AfficherNewslettersAdmins();
    }, 100);
  }

  export(type: any) {
    this.is_loading = true;
    this.Afficher_excel = this.newsletters_service
      .AfficherNewslettersAdmins({
        if_excel: true,
        colone: this.colone,
        order: this.order,
        ...this.FormmulaireRecherche.value,
      })
      .subscribe(
        (res: any) => {
          if (res?.['api_message'] == 'success') {
            if (res?.['Data'].length > 0) {
              let data: any[] = res?.['Data'].map((element: any) => ({
                base_id: element?.base_id,
                email_newsletter: element?.email_newsletter,
                adresse_ip: element?.adresse_ip,
                "Date d'ajout sur le système": element?.created_at_formated
                  ? element?.created_at_formated
                  : '',
              }));
              switch (type) {
                case 'excel':
                  this.generalService.exportAsExcelFile(data, 'listes_emails');
                  break;
                case 'csv':
                  this.generalService.exportAsCsvFile(data, 'listes_emails');
                  break;
                default:
                  this.generalService.exportAsExcelFile(data, 'listes_emails');
                  break;
              }
              this.is_loading = false;
            }
            else {
              this.generalService.errorSwal("Aucun email de bulletins d'information");
              this.is_loading = false;
            }
          }
          else {
            this.generalService.errorSwal('Oups quelque chose a mal tourné ...');
            this.is_loading = false;
          }
        },
        () => {
          this.is_loading = false;
        }
      );
  }

  /* ----------------------- La fonction de suppression ----------------------- */
  SupprimerNewsletter(dataItem: any) {
    Swal.fire({
      title: 'Suppression',
      html: `<b>Êtes-vous sûr de vouloir supprimer l'email de bulletins d'information : </b></br>  ${dataItem?.email_newsletter} ?`,
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#258662',
      cancelButtonColor: '#f50707',
      confirmButtonText: 'Valider',
    }).then((result: any) => {
      if (result?.value) {
        this.is_loading = true;
        this.Supprimer = this.newsletters_service
          .SupprimerNewsletter({ id_newsletter: dataItem?._id })
          .subscribe(
            (r: any) => {
              switch (r?.['api_message']) {
                case 'erreur_de_parametres':
                  this.generalService.errorSwal("Erreur de suppression aucun identifiant n'a été fourni");
                  this.is_loading = false;
                  break;
                case 'supprimer':
                  this.AfficherNewslettersAdmins();
                  this.generalService.errorSwal("Email de bulletins d'information supprimé", 2000, 'success');
                  break;
                case 'non_supprimer':
                  this.generalService.errorSwal('Erreur de suppression');
                  this.is_loading = false;
                  break;
                case 'erreur':
                  this.generalService.errorSwal('Erreur de suppression');
                  this.is_loading = false;
                  break;
                default:
                  this.generalService.errorSwal('Erreur de suppression');
                  this.is_loading = false;
                  break;
              }
            },
            () => { this.is_loading = false; }
          ); // fin subscribe
      } // fin if result swal
    }); // fin then swal
  }

  /* -- Lors de la destruction du composant pour ne pas avoir les memories leaks --*/
  ngOnDestroy(): void {
    let unsubscribe_elements: any[] = [this.afficher, this.Afficher_excel];
    unsubscribe_elements.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}
