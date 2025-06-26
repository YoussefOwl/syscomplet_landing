import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeneralService, UserService, ApiGeneralService } from 'src/app/services/services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-formulaire-ajout',
  templateUrl: './formulaire-ajout.component.html'
})
export class FormulaireAjoutComponent implements OnInit {

  /* ----------------------- les variables globales ----------------------- */
  @Output('FermerPopUp') FermerPopUp = new EventEmitter<boolean>();
  is_loading: boolean = true;
  Ajouter: Subscription;
  Afficher_params: Subscription;
  Restaurer: Subscription;
  /* ----------------------- les variables du formulaire ---------------------- */
  formmulaire_ajouter: FormGroup;
  IsFiled: boolean = false;
  Ifmessage: boolean = false;
  Error: number = 0;
  ApiMessage: any;
  Disabled: boolean = false;
  /* ------------------------------ les listes ----------------------------- */
  liste_roles: any[] = [];
  liste_autorisations: any[] = environment.liste_autorisations;

  constructor(
    public generalService: GeneralService,
    private apiGeneralService: ApiGeneralService,
    private UserService: UserService) {
    /* ---------------------- Initialisation du formulaire ---------------------- */
    this.formmulaire_ajouter = new FormGroup({
      id_role: new FormControl(null, Validators.required),
      has_access: new FormControl(null, Validators.required),
      nom: new FormControl(null, [
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
      ]),
      prenom: new FormControl(null, [
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
      ]),
      email: new FormControl(null, [
        Validators.minLength(10),
        Validators.maxLength(100),
        Validators.email,
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.required
      ]),
      if_has_sound: new FormControl(false)
    });
  }

  ngOnInit(): void {
    this.LoadParamsForList(); // Chargement des listes
  }

  ClosePopUp(state: boolean) {
    this.FermerPopUp.emit(state);
  }

  SubmitAjouter() {
    this.IsFiled = true;
    /* ---------------- Vérification de la validité du formulaire --------------- */
    if (this.formmulaire_ajouter.valid) {
      this.is_loading = true;
      this.Disabled = true;
      this.CallAjouterUtilisateur();
    }
    else {
      this.error('Formulaire invalide !');
      this.generalService.Speak('Formulaire invalide !');
    }
  }

  /* ----- La fonction de modification des informations de compte ----- */
  CallAjouterUtilisateur() {
    this.Ajouter = this.UserService.AjouterUtilisateur(this.formmulaire_ajouter.value)
      .subscribe((r: any) => {
        switch (r?.['api_message']) {
          case "ajouter":
            this.success("Utilisateur ajouté !");
            this.generalService.Speak('Utilisateur ajouté !');
            break;
          case "existant":
            this.error("Erreur, l'email est déja existant !");
            break;
          case "non_ajouter":
            this.error("Oups quelque chose a mal tourné : utilisateur non ajouté");
            this.generalService.Speak('Oups quelque chose a mal tourné : utilisateur non ajouté');
            break;
          case "erreur":
            this.error("Oups quelque chose a mal tourné au niveau du serveur ...");
            this.generalService.Speak('Oups quelque chose a mal tourné au niveau du serveur ..."');
            break;
          case "already_deleted":
            this.is_loading = false;
            this.handle_exicting(r.hasOwnProperty('id_user') ? r?.['id_user'] : null);
            break;
          case "erreur_de_parametres":
            this.error("Erreur de paramètres !");
            break;
          default:
            this.error("Oups quelque chose a mal tourné au niveau du serveur ...");
            this.generalService.Speak('Oups quelque chose a mal tourné au niveau du serveur ..."');
            break;
        }
      }, () => {
        this.error("Oups quelque chose a mal tourné au niveau du serveur ...");
        this.generalService.Speak('Oups quelque chose a mal tourné au niveau du serveur ..."');

      });// end subscribe
  }

  /* ---------------- En cas d'un utilisateur existant et supprimé --------------- */
  handle_exicting(id_user: any) {
    Swal.fire({
      title: "Information",
      html:
        `<b>Cet utilisateur a été récemment supprimé voulez-vous le restaurer ?`,
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
          id_user: id_user
        };
        this.is_loading = true;
        this.Restaurer = this.UserService.RestaurerUser(body)
          .subscribe((r: any) => {
            switch (r?.api_message) {
              case "erreur_de_parametres":
                this.error("Aucun identifiant n'a été fourni");
                break;
              case "success":
                this.success("Utilisateur restauré !");
                break;
              case "non_restaurer":
                this.error('Oups quelque chose a mal tourné au niveau du serveur ...');
                break;
              case "erreur":
                this.error("Oups quelque chose a mal tourné au niveau du serveur ...");
                break;
              default:
                this.error("Oups quelque chose a mal tourné au niveau du serveur ...");
                break;
            }
          }, () => { this.error("Oups quelque chose a mal tourné au niveau du serveur ..."); }); // end subscribe
      } // fin if result swal
      else {
        this.error("Cet Utilisateur a été récemment supprimé !");
      }
    }); // fin then swal
  }

  /* -------------------------------------------------------------------------- */
  /*                        Fonctions gestion des erreurs                       */
  /* -------------------------------------------------------------------------- */

  error(message: any) {
    this.is_loading = false;
    this.Error = 1;
    this.ApiMessage = message;
    this.Disabled = false;
    this.Ifmessage = true;
    setTimeout(() => {
      this.Ifmessage = false;
    }, 3000);
  }

  success(message: any) {
    this.Error = 0;
    this.ApiMessage = message;
    this.Ifmessage = true;
    setTimeout(() => {
      this.Ifmessage = false;
      this.Error = 0;
      this.ApiMessage = null;
      this.is_loading = false;
      setTimeout(() => {
        this.ClosePopUp(true);
      }, 100);
    }, 2000);
  }

  /* -------------------------------------------------------------------------- */
  /*                              Autres fonctions                              */
  /* -------------------------------------------------------------------------- */
  LoadParamsForList() {
    this.Afficher_params = this.apiGeneralService.LoadParamsForList({ roles: true })
      .subscribe({
        next: (res: any) => {
          if (res.hasOwnProperty('api_message') && res?.["api_message"] == "success") {
            /* ------------------------------ les rôles ------------------------------ */
            if (res.hasOwnProperty('liste_roles')) {
              this.liste_roles = res?.["liste_roles"]
                .map((element: any) => (
                  {
                    value: element?.id,
                    label: element?.libelle_role
                  }
                ));
            }
            this.is_loading = false;
          }
          else {
            this.generalService.errorSwal("Oups quelque chose a mal tourné");
            this.is_loading = false;
          }
        },
        error: () => { this.is_loading = false; }
      });
  }

  /* ---------------------- Pour éviter les mémory leaks ---------------------- */
  ngOnDestroy(): void {
    let unsubscribe: any = [
      this.Ajouter,
      this.Afficher_params,
      this.Restaurer
    ];
    unsubscribe.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}