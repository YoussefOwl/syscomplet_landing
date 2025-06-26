import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeneralService, UserService } from 'src/app/services/services';
import Swal from 'sweetalert2';
import { FormGroup, FormControl } from "@angular/forms";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-liste',
  templateUrl: './liste_utlisateurs.component.html'
})

export class ListeUtilisateurComponent implements OnInit {
  /* ------------------------- Les variables globales ------------------------- */
  Afficher_excel: Subscription;
  Afficher: Subscription;
  Ajouter: Subscription;
  Supprimer: Subscription;
  is_loading: boolean = true;
  /* ------------------------ les variables d'affichage ----------------------- */
  skip: any = 0;
  take: any = 10;
  order: any = "desc";
  colone: any = "has_access";
  totalRecords: any = 0;
  ListeUtilisateurs: any[] = [];
  /* -------------------------- Les variables Popups -------------------------- */
  Header_info: any;
  image_path: any;
  if_show_info: boolean = false;
  if_show_image: boolean = false;
  if_show_password: boolean = false;
  if_show_parametrage: boolean = false;
  if_show_ajouter: boolean = false;
  /* ---------------------- Les variables de la recherche --------------------- */
  FormmulaireRecherche: FormGroup;
  data_user: any;
  id_user: any;
  liste_autorisations: any[] = environment.liste_autorisations;

  constructor(
    public generalService: GeneralService,
    private UserService: UserService) {
    /* ---------------- Initialisation du formulaire de recherche ---------------- */
    this.FormmulaireRecherche = new FormGroup({
      nom_complet: new FormControl(null),
      has_access: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.AfficherUtilisateur();
  }

  /* -------------------------------------------------------------------------- */
  /*                           Les fonctions d'affichage                        */
  /* -------------------------------------------------------------------------- */

  ClearSearch() {
    this.FormmulaireRecherche.reset();
    this.RechercherUtilisateur();
  }

  RechercherUtilisateur() {
    this.skip = 0;
    this.take = 10;
    setTimeout(() => {
      this.AfficherUtilisateur();
    }, 100);
  }

  AfficherUtilisateur() {
    this.is_loading = true;
    /* ------------------------ l'objet à envoyer à l'api ----------------------- */
    let body: any = {
      colone: this.colone,
      order: this.order,
      skip: this.skip,
      take: this.take,
      nom_complet: this.FormmulaireRecherche.value.nom_complet,
      has_access: this.FormmulaireRecherche.value.has_access
    };
    this.Afficher = this.UserService.AfficherUtilisateur(body)
      .subscribe((r: any) => {
        if (r.hasOwnProperty('api_message') && (r?.api_message == "success")) {
          this.ListeUtilisateurs = r.hasOwnProperty('Data') ? r?.["Data"] : [];
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
      this.AfficherUtilisateur();
    }, 100);
  }

  Sort(event: any) {
    this.colone = event?.field
    this.order = (event?.order == -1) ? "desc" : "asc";
    setTimeout(() => {
      this.AfficherUtilisateur();
    }, 100);
  }

  exportToExcel() {
    this.is_loading = true;
    let body: any = {
      if_excel: true,
      colone: this.colone,
      order: this.order,
      nom_complet: this.FormmulaireRecherche.value.nom_complet,
      has_access: this.FormmulaireRecherche.value.has_access
    };
    this.Afficher_excel = this.UserService.AfficherUtilisateur(body)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('api_message') && res?.["api_message"] == "success") {
          if (res?.Data.length > 0) {
            let myFormatedData: any[] = [];
            res?.["Data"].forEach((element: any) => {
              myFormatedData?.push({
                'Nom': element?.nom,
                'Prénom': element?.prenom,
                'Rôle': element?.libelle_role,
                'Email': element?.email,
                'Autorisation': element?.label_has_access,
                'Date d\'ajout sur le système': element?.created_at_formated ? element?.created_at_formated : '',
                'Date de modification': element?.updated_at_formated ? element?.updated_at_formated : ''
              });
            });
            setTimeout(() => {
              this.generalService.exportAsExcelFile(myFormatedData, 'Liste_utilisateurs');
              this.is_loading = false;
            }, 100);
          }
          else {
            this.generalService.errorSwal('Aucun utilisateur');
            this.is_loading = false;
          }
        }
        else {
          this.generalService.errorSwal('Oups quelque chose a mal tourné au niveau du serveur ...');
          this.is_loading = false;
        }
      }, () => { this.is_loading = false; })
  }

  /* ----------------------------- La suppression ----------------------------- */
  SupprimerUtilisateur(data: any) {
    Swal.fire({
      title: "Suppression",
      html:
        `<b>Êtes-vous sûr de vouloir supprimer l'utilisateur </b></br>  ${data?.nom_complet} ?`,
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
          id: data?._id, // identifiant crypté d'utilisateur à supprimer 
          id_user: this.generalService.get_data_from_session_decrypted('id_user')
        };
        this.is_loading = true;
        this.Supprimer = this.UserService.SupprimerUtilisateur(body)
          .subscribe((r: any) => {
            switch (r?.api_message) {
              case "erreur_de_parametres":
                this.generalService.errorSwal("Erreur de suppression aucun identifiant n'a été fourni");
                this.is_loading = false;
                break;
              case "supprimer":
                this.AfficherUtilisateur();
                this.generalService.errorSwal("Utilisateur supprimé !", 2000, "success");
                break;
              case "non_supprimer":
                this.generalService.errorSwal('Erreur de suppression');
                this.is_loading = false;
                break;
              case "action_impossible":
                this.generalService.errorSwal('Vous ne pouvez pas supprimer votre compte !');
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
          }, () => { this.is_loading = false; }); // end subscribe
      } // fin if result swal
    }); // fin then swal
  }

  /* -------------------------------------------------------------------------- */
  /*                          Les focntions des popUps                          */
  /* -------------------------------------------------------------------------- */

  /* -------------------------- Modification des infos du profile ------------------------- */
  ShowUtilisateur(action: any, data: any = null) {
    // Modification
    if (action == "modifier" && data) {
      this.Header_info = `Modification informations : (${data?.libelle_role} ${data?.nom_complet})`;
      this.id_user = data?._id;
      setTimeout(() => {
        this.if_show_info = true;
      }, 100);
    }
    // Ajout
    else {
      this.Header_info = `Formulaire d'ajout utilisateur :`;
      this.id_user = null;
      setTimeout(() => {
        this.if_show_ajouter = true;
      }, 100);
    }
  }

  /* ------------------ Fermeture popup update infos profile ------------------ */
  ClosePopUpInfo() {
    this.skip = 0;
    setTimeout(() => {
      this.if_show_info = false;
      this.AfficherUtilisateur();
    }, 100);
  }

  /* ---------------- Férmeture du popup Ajout des utilisateurs ---------------- */
  CloseAjouter(event: boolean) {
    if (!event) {
      this.if_show_ajouter = false;
    }
    else {
      this.AfficherUtilisateur();
      setTimeout(() => {
        this.if_show_ajouter = false;
      }, 250);
    }
  }

  /* ----------------------- Modifier l'image---------------------- */
  ShowimageUpdate(data: any) {
    this.Header_info = `Modification image : (${data?.libelle_role} ${data?.nom_complet})`;
    this.id_user = data?._id;
    this.image_path = data?.image_user_path;
    setTimeout(() => {
      this.if_show_image = true;
    }, 100);
  }

  /* -------------------------- Fermer le popup image ------------------------- */
  CloseImages() {
    /* ----------------- Fermetture et libération des variables ----------------- */
    this.id_user = null;
    this.image_path = null;
    this.if_show_image = false;
    this.AfficherUtilisateur();
  }

  /* ---------------------- Modification du mot de passe ---------------------- */
  ShowUpdatePassWord(data: any) {
    this.Header_info = `Modification mot de passe : (${data?.libelle_role} ${data?.nom_complet})`;
    this.id_user = data?._id;
    setTimeout(() => {
      this.if_show_password = true;
    }, 100);
  }

  /* ------------------ Modifier du rôle ou le droit d'accès ------------------ */
  ShowUpdateParams(data: any) {
    this.Header_info = `Utilsateur : ${data?.libelle_role} ${data?.nom_complet}`;
    this.data_user = data;
    setTimeout(() => {
      this.if_show_parametrage = true;
    }, 100);
  }

  /* ---------------- Férmeture du popup modification paramètres des utilisateurs ---------------- */
  CloseParametres() {
    this.if_show_parametrage = false;
    this.AfficherUtilisateur();
  }

  CloseUpdate() {
    this.if_show_info = false;
    this.AfficherUtilisateur();
  }

  ClosePassword() {
    this.if_show_password = false;
    this.AfficherUtilisateur();
  }

  /* --------------------- Pour éviter les mémories leaks --------------------- */
  ngOnDestroy(): void {
    let unsubscribe_liste: any = [
      this.Ajouter,
      this.Supprimer,
      this.Afficher_excel,
      this.Afficher
    ];
    unsubscribe_liste.forEach((element: any) => {
      if (element) {
        element?.unsubscribe();
      }
    });
  }

}