import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeneralService, UserService, ApiGeneralService } from 'src/app/services/services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-formulaire-parametrage',
  templateUrl: './formulaire-parametrage.component.html'
})
export class FormulaireParametrageomponent implements OnInit {

  /* ----------------------- les variables globales ----------------------- */
  @Output('FermerPopUp') FermerPopUp = new EventEmitter<boolean>();
  @Input("data_user") data_user: any; // les informations d'utilisateur
  is_loading: boolean = true;
  Modifier: Subscription;
  Afficher_params: Subscription;
  /* ----------------------- les variables du formulaire ---------------------- */
  formmulaire_parametrage: FormGroup;
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
    this.formmulaire_parametrage = new FormGroup({
      _id: new FormControl(null, Validators.required),
      has_access: new FormControl(null, Validators.required),
      id_role: new FormControl(null, Validators.required),
      if_has_sound: new FormControl(false)
    });
  }

  ngOnInit(): void {
    /* ------------- Appel aux fonctions de récupération des données ------------- */
    this.LoadParamsForList(this.data_user?.["id_role"]);
    /* ------------------------------ Data binding ------------------------------ */
    this.formmulaire_parametrage.get('_id').setValue(this.data_user.hasOwnProperty('_id') ? this.data_user?.["_id"] : null);
    this.formmulaire_parametrage.get('if_has_sound').setValue(this.data_user.hasOwnProperty('if_has_sound') ? this.data_user?.["if_has_sound"] : null);
    this.formmulaire_parametrage.get('has_access').setValue(this.data_user.hasOwnProperty('has_access') ? this.data_user?.["has_access"] : null);
  }

  ClosePopUp() {
    this.FermerPopUp.emit();
  }

  SubmitUpdate() {
    this.IsFiled = true;
    /* ---------------- Vérification de la validité du formulaire --------------- */
    if (this.formmulaire_parametrage.valid) {
      /* ---------------------- Si on spécifie les deux dates --------------------- */
      this.is_loading = true;
      this.Disabled = true;
      this.ModifierParmsUtilisateur();
    }
    else {
      this.error('Formulaire invalide !');
    }
  }

  /* ----- La fonction de modification des informations de compte ----- */
  ModifierParmsUtilisateur() {
    this.Modifier = this.UserService.ModifierParmsUtilisateur(this.formmulaire_parametrage.value)
      .subscribe((r: any) => {
        switch (r?.['api_message']) {
          case "modifier":
            this.success("Paramètres mis à jour !");
           
            break;
          case "non_modifier":
            this.error("Oups quelque chose a mal tourné : paramètres utilisateur non modifiés");
            break;
          case "action_impossible":
            this.error("Erreur vous ne pouvez pas changer votre rôle !");
            break;
          case "erreur":
            this.error("Oups quelque chose a mal tourné au niveau du serveur ...");
            break;
          case "erreur_de_parametres":
            this.error("Erreur de paramètres !");
            break;
          default:
            this.error("Oups quelque chose a mal tourné au niveau du serveur ...");
            break;
        }
      }, () => {
        this.error("Oups quelque chose a mal tourné au niveau du serveur ...");
      });// end subscribe
  }

  /* ---------------------- Fonction gestion des erreurs ---------------------- */
  error(message: any) {
    this.is_loading = false;
    this.Error = 1;
    this.ApiMessage = message;
    this.Disabled = false;
    this.Ifmessage = true;
    setTimeout(() => {
      this.Ifmessage = false;
    }, 2000);
  }

  success(message: any) {
    this.Error = 0;
    this.IsFiled = false;
    this.ApiMessage = message;
    this.Ifmessage = true;
    setTimeout(() => {
      this.Ifmessage = false;
      this.Error = 0;
      this.ApiMessage = "";
      this.is_loading = false;
      this.ClosePopUp();
    }, 2000);
  }

  LoadParamsForList(id_role: any) {
    this.Afficher_params = this.apiGeneralService.LoadParamsForList({ roles: true })
      .subscribe((res: any) => {
        if (res.hasOwnProperty('api_message') && res?.["api_message"] == "success") {
          new Promise((resolve) => {
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
            resolve(id_role);
          }).then((value: any) => {
            this.formmulaire_parametrage.get('id_role').setValue(value);
          });
          this.is_loading = false;
        }
        else {
          this.generalService.errorSwal("Oups quelque chose a mal tourné");
          this.is_loading = false;
        }
      }, () => { this.is_loading = false; });
  }

  /* ---------------------- Pour éviter les mémory leaks ---------------------- */
  ngOnDestroy(): void {
    let unsubscribe_liste: any = [
      this.Modifier,
      this.Afficher_params
    ];
    unsubscribe_liste.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}