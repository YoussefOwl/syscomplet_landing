import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from "@angular/forms";
import { GeneralService, ConfigurationsService, ApiGeneralService } from 'src/app/services/services';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html'
})
export class LogsComponent implements OnInit {
  /* ------------------------------ Les variables globales ----------------------------- */
  is_loading: boolean = true;
  Afficher: Subscription;
  Afficher_excel: Subscription;
  Afficher_params: Subscription;
  /* ------------------------ les variables d'affichage ----------------------- */
  skip: any = 0;
  take: any = 10;
  order: any = "desc";
  colone: any = "created_at";
  totalRecords: any = 0;
  liste_logs: any[] = [];
  liste_users: any[] = [];
  liste_tables: any[] = [];
  FormmulaireRecherche: FormGroup;

  constructor(
    public generalService: GeneralService,
    private apiGeneralService: ApiGeneralService,
    private configurationsService: ConfigurationsService) {
    /* ---------------------- Initialisation du formulaire ---------------------- */
    this.FormmulaireRecherche = new FormGroup({
      debut: new FormControl(null),
      fin: new FormControl(null),
      id_user: new FormControl(null),
      description: new FormControl(null),
      libelle_log: new FormControl(null),
      table_name: new FormControl(null),
      json_log_data: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.AfficherLogs();
    this.LoadParamsForList();
  }

  ClearSearch() {
    this.FormmulaireRecherche.reset();
    setTimeout(() => {
      this.RechercherLogs();
    }, 100);
  }

  RechercherLogs() {
    let debut: any = this.FormmulaireRecherche.get('debut').value;
    let fin: any = this.FormmulaireRecherche.get('fin').value;
    if (debut && fin) {
      if (this.generalService.CheckIfDateValid(debut, fin)) {
        this.skip = 0;
        this.take = 10;
        setTimeout(() => {
          this.AfficherLogs();
        }, 100);
      }
      else {
        this.generalService.errorSwal("Formulaire invalide, l'intervalle temporel est invalide !");
      }
    }
    else {
      this.skip = 0;
      this.take = 10;
      setTimeout(() => {
        this.AfficherLogs();
      }, 100);
    }
  }

  LoadParamsForList() {
    this.Afficher_params = this.apiGeneralService.LoadParamsForList({ users: true, tables: true })
      .subscribe((res: any) => {
        if (res.hasOwnProperty('api_message') && res?.["api_message"] == "success") {
          /* ------------------------------ les utilisateurs ------------------------------ */
          this.liste_users = res?.["liste_users"]
            .map((element: any) => (
              {
                value: element?.id,
                label: element?.nom_complet
              }
            ));
          /* ------------------------------- les tables ------------------------------- */
          this.liste_tables = res?.["liste_tables"]
            .map((element: any) => (
              {
                value: element,
                label: element
              }
            ));
        }
        else {
          this.generalService.errorSwal("Oups quelque chose a mal tourné");
        }
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                       Les fonctions pour l'affichage                       */
  /* -------------------------------------------------------------------------- */

  AfficherLogs() {
    this.is_loading = true;
    let body: any = {
      colone: this.colone,
      order: this.order,
      skip: this.skip,
      take: this.take,
      ...this.FormmulaireRecherche.value
    };
    this.Afficher = this.configurationsService.AfficherLogs(body)
      .subscribe((r: any) => {
        if (r.hasOwnProperty('api_message') && (r?.api_message == "success")) {
          this.liste_logs = r.hasOwnProperty('Data') ? r?.["Data"] : [];
          this.totalRecords = r.hasOwnProperty('totalRecords') ? r?.["totalRecords"] : 0;
          this.is_loading = false;
        }
        else {
          this.generalService.errorSwal("Oups quelque chose a mal tourné");
          this.is_loading = false;
        }
      }, () => {
        this.is_loading = false;
      });
  }

  paginate(event: any) {
    this.take = event?.rows;
    this.skip = event?.first;
    setTimeout(() => {
      this.AfficherLogs();
    }, 100);
  }

  Sort(event: any) {
    this.colone = event?.field
    this.order = (event?.order == -1) ? "desc" : "asc";
    setTimeout(() => {
      this.AfficherLogs();
    }, 100);
  }

  exportToExcel() {
    this.is_loading = true;
    let body: any = {
      colone: this.colone,
      order: this.order,
      if_excel: true,
      ...this.FormmulaireRecherche.value
    };
    this.Afficher_excel = this.configurationsService.AfficherLogs(body)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('api_message') && res?.["api_message"] == "success") {
          if (res?.Data.length > 0) {
            this.generalService.exportAsExcelFile(
              res?.["Data"].map((element: any) => (
                {
                  'Utilisateur': element?.nom_complet,
                  'Libellé de l\'action': element?.libelle_log,
                  'Le nom de table': element?.table_name,
                  'Date d\'ajout sur le système': element?.created_at_formated ? element?.created_at_formated : '',
                  'Date de modification': element?.updated_at_formated ? element?.updated_at_formated : '',
                  'Observation': element?.description ? element?.description : '...'
                }
              )), 'liste_logs');
            this.is_loading = false;
          }
          else {
            this.generalService.errorSwal('Aucun log');
            this.is_loading = false;
          }
        }
        else {
          this.generalService.errorSwal('Oups quelque chose a mal tourné au niveau du serveur ...');
          this.is_loading = false;
        }
      }, () => { this.is_loading = false; })
  }

  /* -- Lors de la destruction du composant pour ne pas avoir les memories leaks --*/
  ngOnDestroy(): void {
    let unsubscribe_liste: any[] = [
      this.Afficher,
      this.Afficher_params,
      this.Afficher_excel
    ];
    unsubscribe_liste.forEach((element: any) => {
      if (element) {
        element?.unsubscribe();
      }
    });
  }
}