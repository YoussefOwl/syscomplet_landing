import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from "@angular/forms";
import { GeneralService, ContactsService } from 'src/app/services/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contacts-liste',
  templateUrl: './contacts_liste.component.html'
})
export class ContactsListeComponent implements OnInit {
  /* ------------------------------ Les variables globales ----------------------------- */
  is_loading: boolean = true;
  afficher: Subscription;
  Afficher_excel: Subscription;
  /* ------------------------ les variables d'affichage ----------------------- */
  skip: any = 0;
  take: any = 10;
  order: any = "desc";
  colone: any = "date_contact";
  totalRecords: any = 0;
  liste_contacts: any[] = [];
  FormmulaireRecherche: FormGroup;
  liste_status_contact: any[] = environment.liste_status_contact;
  liste_sujet_contact: any[] = environment.liste_sujet_contact;

  constructor(
    public generalService: GeneralService,
    private contacts_service: ContactsService) {
    /* ---------------------- Initialisation du formulaire ---------------------- */
    this.FormmulaireRecherche = new FormGroup({
      debut: new FormControl(null),
      fin: new FormControl(null),
      sujet_contact: new FormControl(null),
      status_contact: new FormControl(null),
      email_contact: new FormControl(null),
      first_and_last_name: new FormControl(null),
      adresse_ip: new FormControl(null),
      message_contact: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.AfficherContactsAdmins();
  }

  /* -------------------------------------------------------------------------- */
  /*                       Les fonctions pour l'affichage                       */
  /* -------------------------------------------------------------------------- */

  ClearSearch() {
    this.FormmulaireRecherche.reset();
    this.Rechercher();
  }

  Rechercher() {
    let debut: any = this.FormmulaireRecherche.get('debut').value;
    let fin: any = this.FormmulaireRecherche.get('fin').value;
    if (debut && fin) {
      if (this.generalService.CheckIfDateValid(debut, fin)) {
        this.ContinueSerach();
      }
      else {
        this.generalService.errorSwal("Formulaire invalide, l'intervalle temporel est invalide !");
      }
    }
    else {
      this.ContinueSerach();
    }
  }

  ContinueSerach() {
    this.skip = 0;
    this.take = 10;
    setTimeout(() => {
      this.AfficherContactsAdmins();
    }, 100);
  }

  AfficherContactsAdmins() {
    this.is_loading = true;
    let body: any = {
      colone: this.colone,
      order: this.order,
      skip: this.skip,
      take: this.take,
      ...this.FormmulaireRecherche.value
    };
    this.afficher = this.contacts_service.AfficherContactsAdmins(body)
      .subscribe((r: any) => {
        if (r?.["api_message"] == "success") {
          this.liste_contacts = r.hasOwnProperty('Data') ? r?.["Data"] : [];
          this.totalRecords = r.hasOwnProperty('totalRecords') ? r?.["totalRecords"] : 0;
          setTimeout(() => { this.is_loading = false; }, 500);
        }
        else {
          this.generalService.errorSwal("Oups quelque chose a mal tourné ...");
          this.is_loading = false;
        }
      }, () => { this.is_loading = false; });
  }

  paginate(event: any) {
    this.take = event?.rows;
    this.skip = event?.first;
    setTimeout(() => {
      this.AfficherContactsAdmins();
    }, 100);
  }

  Sort(event: any) {
    this.colone = event?.field;
    this.order = (event?.order == -1) ? "desc" : "asc";
    setTimeout(() => {
      this.AfficherContactsAdmins();
    }, 100);
  }

  export(type: any) {
    this.is_loading = true;
    this.Afficher_excel = this.contacts_service.AfficherContactsAdmins({
      if_excel: true,
      colone: this.colone,
      order: this.order,
      ...this.FormmulaireRecherche.value
    }).subscribe((res: any) => {
      if (res?.["api_message"] == "success") {
        if (res?.["Data"].length > 0) {
          let data: any[] = res?.["Data"].map((element: any) => (
            {
              'numero_demande': element?.base_id,
              'nom_utilisateur': element?.first_and_last_name,
              'email': element?.email_contact,
              'sujet': element?.label_sujet_contact,
              'message': element?.message_contact,
              'date': element?.date_contact,
              'status_contact': element?.label_status_contact,
              'adresse_ip': element?.adresse_ip,
              "Date d'ajout sur le système": element?.created_at_formated ? element?.created_at_formated : '',
              "Date de la dernière modification": element?.updated_at_formated ? element?.updated_at_formated : '',
            }
          ));
          switch (type) {
            case "excel":
              this.generalService.exportAsExcelFile(data, 'listes_demandes_contacts');
              break;
            case "csv":
              this.generalService.exportAsCsvFile(data, 'listes_demandes_contacts');
              break;
            default:
              this.generalService.exportAsExcelFile(data, 'listes_demandes_contacts');
              break;
          }
          this.is_loading = false;
        }
        else {
          this.generalService.errorSwal('Aucune demande de contact');
          this.is_loading = false;
        }
      }
      else {
        this.generalService.errorSwal("Oups quelque chose a mal tourné ...");
        this.is_loading = false;
      }
    }, () => { this.is_loading = false; });
  }

  ModifierContacts(_id: any) {
    this.generalService
      .sweetAlert(
        "Confirmation",
        "Êtes-vous certain(e) de vouloir valider le changement d'état ?",
        "question"
      )
      .then((res: any) => {
        if (res?.isConfirmed) {
          this.is_loading = true;
          this.afficher = this.contacts_service.ModifierContacts({ _id: _id })
            .subscribe((r: any) => {
              switch (r?.['api_message']) {
                case "modifier":
                  this.is_loading = false;
                  this.generalService.errorSwal('État de demande modifié', 2000, 'success');
                  this.generalService.Speak('État de demande modifié');
                  setTimeout(() => { this.AfficherContactsAdmins(); }, 2100);
                  break;
                case "non_modifier":
                  this.generalService.errorSwal("Oups quelque chose a mal tourné ...");
                  this.is_loading = false;
                  break;
                case "erreur":
                  this.generalService.errorSwal("Oups quelque chose a mal tourné ...");
                  this.is_loading = false;
                  break;
                case "erreur_de_parametres":
                  this.generalService.errorSwal("Erreur de paramètres !");
                  this.is_loading = false;
                  break;
                default:
                  this.generalService.errorSwal("Oups quelque chose a mal tourné ...");
                  this.is_loading = false;
                  break;
              }
            }, () => { this.is_loading = false; });
        }
      });
  }

  /* -- Lors de la destruction du composant pour ne pas avoir les memories leaks --*/
  ngOnDestroy(): void {
    let unsubscribe_elements: any[] = [
      this.afficher,
      this.Afficher_excel
    ];
    unsubscribe_elements.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}