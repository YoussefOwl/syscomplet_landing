import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from "@angular/forms";
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { GeneralService, ApiGeneralService, PartenairesService } from 'src/app/services/services';

@Component({
  selector: 'app-partenaire-liste',
  templateUrl: './partenaire_liste.component.html'
})
export class PartenaireListeComponent implements OnInit {
  /* ------------------------------ Les variables globales ----------------------------- */
  is_loading: boolean = true;
  Afficher_Partenaire: Subscription;
  Afficher_excel: Subscription;
  afficher_params: Subscription;
  Supprimer: Subscription;
  /* ------------------------ les variables d'affichage ----------------------- */
  skip: any = 0;
  take: any = 10;
  order: any = "asc";
  colone: any = "libelle_partenaire";
  totalRecords: any = 0;
  ListePartenaire: any[] = [];
  FormmulaireRecherche: FormGroup;
  API_BASE_URL_STORAGE_PARTENAIRES: any = environment.API_BASE_URL_STORAGE_PARTENAIRES;
  /* ----------------- Les variables du popup ajout ou update ----------------- */
  Header_info: any;
  if_show_ajouter: boolean = false;
  action: any;
  data_partenaire: any;
  /* ------------------------- le popup détails image ------------------------- */
  desc_image: any;
  if_show_image: boolean = false;
  logo_partenaire: any;
  /* --------------------------------- upload --------------------------------- */
  if_show_upload: boolean = false;
  /* ------------------------------- les listes ------------------------------- */
  liste_autorisations: any[] = environment.liste_autorisations;
  liste_villes: any[] = [];

  constructor(
    public generalService: GeneralService,
    private apiGeneralService: ApiGeneralService,
    private partenairesService: PartenairesService) {
    /* ---------------------- Initialisation du formulaire ---------------------- */
    this.FormmulaireRecherche = new FormGroup({
      libelle_partenaire: new FormControl(null),
      ice_partenaire: new FormControl(null),
      id_ville: new FormControl(null),
      email_partenaire: new FormControl(null),
      autorisation_partenaire: new FormControl(null)
    });
  }

  ngOnInit(): void {
    /* ------------------------ Récupération des données ------------------------ */
    this.AfficherPartenaire();
    this.LoadParamsForList();
  }

  /* --------------------- les fonctions pour la recherche -------------------- */

  LoadParamsForList() {
    let body: any = {
      villes: true
    };
    this.afficher_params = this.apiGeneralService.LoadParamsForList(body)
      .subscribe({
        next: (res: any) => {
          if (res.hasOwnProperty('api_message') && res?.["api_message"] == "success") {
            /* -------------------------------- les villes ------------------------------- */
            if (res.hasOwnProperty('liste_villes')) {
              this.liste_villes = res?.["liste_villes"]
              .map((element: any) => (
                {
                  value: element?.id,
                  label: element?.libelle_ville
                }
              ));
            }
          }
          else {
            this.generalService.errorSwal("Oups quelque chose a mal tourné au niveau du serveur !");
            this.is_loading = false;
          }
        },
        error: () => { this.is_loading = false; }
      });

  }
  /* -------------------------------------------------------------------------- */
  /*                       Les fonctions pour l'affichage                       */
  /* -------------------------------------------------------------------------- */

  ClearSearch() {
    this.FormmulaireRecherche.reset();
    this.RechercherPartenaire();
  }

  RechercherPartenaire() {
    this.skip = 0;
    this.take = 10;
    setTimeout(() => {
      this.AfficherPartenaire();
    }, 100);
  }

  AfficherPartenaire() {
    this.is_loading = true;
    let body: any = {
      colone: this.colone,
      order: this.order,
      skip: this.skip,
      take: this.take,
      ...this.FormmulaireRecherche.value
    };
    this.Afficher_Partenaire = this.partenairesService.AfficherPartenaire(body)
      .subscribe((r: any) => {
        if (r?.["api_message"] == "success") {
          this.ListePartenaire = r.hasOwnProperty('Data') ? r?.["Data"] : [];
          this.totalRecords = r.hasOwnProperty('totalRecords') ? r?.["totalRecords"] : 0;
          setTimeout(() => {
            this.is_loading = false;
          }, 100);
        }
        else {
          this.generalService.errorSwal("Oups quelque chose a mal tourné au niveau du serveur !");
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
      this.AfficherPartenaire();
    }, 100);
  }

  Sort(event: any) {
    this.colone = event?.field;
    this.order = (event?.order == -1) ? "desc" : "asc";
    setTimeout(() => {
      this.AfficherPartenaire();
    }, 100);
  }

  exportToExcel() {
    this.is_loading = true;
    let body: any = {
      if_excel: true,
      colone: this.colone,
      order: this.order,
      ...this.FormmulaireRecherche.value
    };
    this.Afficher_excel = this.partenairesService.AfficherPartenaire(body)
      .subscribe({
        next: (res: any) => {
          if (res?.["api_message"] == "success") {
            if (res?.["Data"].length > 0) {
              new Promise((resolve) => {
                let myFormatedData: any[] = [];
                res?.["Data"].forEach((element: any) => {
                  myFormatedData.push({
                    'Libellé': element?.libelle_partenaire,
                    'Email': element?.email_partenaire,
                    'ICE': element?.ice_partenaire,
                    'État': element?.label_autorisation_partenaire,
                    'Type de partenaire': element?.label_type_societe_partenaire,
                    'Ville': element?.libelle_ville,
                    'Téléphone': element?.telephone_partenaire,
                    'RIB': element?.rib_partenaire,
                    'Identifiant fiscale': element?.identifiant_fiscal_partenaire ? element?.identifiant_fiscal_partenaire : '',
                    'Registre de commerce': element?.registre_commerce_partenaire ? element?.registre_commerce_partenaire : '',
                    'Adresse': element?.adresse_partenaire ? element?.adresse_partenaire : '',
                    'Fax': element?.fax_partenaire ? element?.fax_partenaire : '',
                    'Nom complet du responsable': element?.responsable_nom_complet ? element?.responsable_nom_complet : '',
                    'Téléphone du responsable': element?.responsable_telephone ? element?.responsable_telephone : '',
                    'Email du responsable': element?.responsable_email ? element?.responsable_email : '',
                    "Date d'ajout sur le système": element?.created_at_formated ? element?.created_at_formated : '',
                    "Date de la dernière modification": element?.updated_at_formated ? element?.updated_at_formated : '',
                    "Description": element?.description ? element?.description : ''
                  });
                });
                resolve(myFormatedData);
              }).then((data: any[]) => {
                setTimeout(() => {
                  this.generalService.exportAsExcelFile(data, 'Liste_partenaires');
                  this.is_loading = false;
                }, 100);
              });
            }
            else {
              this.generalService.errorSwal('Aucun partenaire');
              this.is_loading = false;
            }
          }
          else {
            this.generalService.errorSwal("Oups quelque chose a mal tourné au niveau du serveur !");
            this.is_loading = false;
          }
        },
        error: () => { this.is_loading = false; }
      });
  }

  /* ----------------------- La fonction de suppression ----------------------- */
  SupprimerPartenaire(dataItem: any) {
    Swal.fire({
      title: "Suppression",
      html:
        `<b>Êtes-vous sûr de vouloir supprimer le partenaire : </b></br>  ${dataItem?.libelle_partenaire} ?`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      cancelButtonText: "Annuler",
      confirmButtonColor: "#258662",
      cancelButtonColor: "#f50707",
      confirmButtonText: "Valider"
    }).then((result: any) => {
      if (result?.value) {
        let body: any = {
          id_partenaire: dataItem?._id
        };
        this.is_loading = true;
        this.Supprimer = this.partenairesService.SupprimerPartenaire(body)
          .subscribe((r: any) => {
            switch (r?.["api_message"]) {
              case "erreur_de_parametres":
                this.generalService.errorSwal("Erreur de suppression aucun identifiant n'a été fourni");
                this.is_loading = false;
                break;
              case "supprimer":
                this.AfficherPartenaire();
                this.generalService.errorSwal("Partenaire supprimé !", 2000, "success");
                break;
              case "non_supprimer":
                this.generalService.errorSwal('Erreur de suppression');
                this.is_loading = false;
                break;
              case "erreur":
                this.generalService.errorSwal("Erreur de suppression");
                this.is_loading = false;
                break;
              default:
                this.generalService.errorSwal("Erreur de suppression");
                this.is_loading = false;
                break;
            }
          }, () => { this.is_loading = false; }); // fin subscribe
      } // fin if result swal
    }); // fin then swal
  }

  /* -------------------------------------------------------------------------- */
  /*                            Ajout ou modification                           */
  /* -------------------------------------------------------------------------- */
  ShowFormulaire(action: any, dataItem: any = null) {
    if (action == "modifier")  // Modification
    {
      this.data_partenaire = dataItem;
      this.action = "modifier";
      this.Header_info = `Modification (${dataItem?.libelle_partenaire})`;
      setTimeout(() => {
        this.if_show_ajouter = true;
      }, 100);
    }
    else // Ajout
    {
      this.Header_info = `Formulaire d'ajout partenaire :`;
      this.data_partenaire = null;
      this.action = "ajouter";
      setTimeout(() => {
        this.if_show_ajouter = true;
      }, 100);
    }
  }

  /* ---------------- Férmeture du popup Ajout des partenaires ---------------- */
  CloseAjouter() {
    this.if_show_ajouter = false;
    this.AfficherPartenaire();
  }

  /* -------------- Fonction pour agrandir une image de Partenaire -------------- */
  Showimage(dataItem: any) {
    this.is_loading = true;
    this.logo_partenaire = dataItem?.logo_partenaire;
    this.desc_image = `${dataItem?.libelle_partenaire}`;
    setTimeout(() => {
      this.if_show_image = true;
      setTimeout(() => {
        this.is_loading = false;
      }, 100);
    }, 100);
  }

  /* -------------------------------------------------------------------------- */
  /*                       Fonctions upload image Partenaire                   */
  /* -------------------------------------------------------------------------- */

  /* ---------------- Férmeture du popup upload image Partenaire ---------------- */
  CloseImageUopload() {
    this.if_show_upload = false;
    this.AfficherPartenaire();
  }

  ShowimageUpdate(data: any) {
    this.data_partenaire = data;
    this.Header_info = `Modification d'image du partenaire : (${data?.libelle_partenaire})`;
    setTimeout(() => {
      this.if_show_upload = true;
    }, 100);
  }

  /* -- Lors de la destruction du composant pour ne pas avoir les memories leaks --*/
  ngOnDestroy(): void {
    let unsubscribe_elements: any[] = [
      this.Afficher_Partenaire,
      this.Afficher_excel,
      this.afficher_params,
      this.Supprimer
    ];
    unsubscribe_elements.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}