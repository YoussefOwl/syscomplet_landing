import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { GeneralService, ApiGeneralService, PartenairesService } from 'src/app/services/services';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulaire-ajout-update-partenaire',
  templateUrl: './partenaire_ajout_update.component.html'
})
export class AjouterPartenaireComponent implements OnInit {

  /* ------------------------------ Les variables globales ----------------------------- */
  Ajouter: Subscription;
  Modifier: Subscription;
  afficher_params: Subscription;
  Restaurer: Subscription;
  @Output('FermerPopUp') FermerPopUp = new EventEmitter<boolean>();
  @Input("data_partenaire") data_partenaire: any; // les données de la ligne en cas de modification
  @Input("action") action: string; // ajout ou bien modification
  is_loading: boolean = true;
  /* ----------------------- les variables du formulaire ---------------------- */
  FormmulairePartenaire: FormGroup;
  IsFiled: boolean = false;
  Ifmessage: boolean = false;
  Error: number = 0;
  ApiMessage: any;
  Disabled: boolean = false;
  Buttontext: any;
  /* ------------------------------- les listes ------------------------------- */
  liste_autorisations: any[] = environment.liste_autorisations;
  liste_type_societe: any[] = environment.liste_type_societe;
  liste_villes: any[] = [];

  constructor(
    public generalService: GeneralService,
    private messageService: MessageService,
    private apiGeneralService: ApiGeneralService,
    private partenairesService: PartenairesService) {
    /* ---------------------- Initialisation du formulaire ---------------------- */
    this.FormmulairePartenaire = new FormGroup({
      /* ---------------------------- Les champs requis --------------------------- */
      _id: new FormControl(null, Validators.required),
      libelle_partenaire: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      /* -------------------------- Les champs non requis ------------------------- */
      telephone_partenaire: new FormControl(null, [Validators.minLength(10), Validators.pattern("[0-9\/]*")]),
      email_partenaire: new FormControl(null, [Validators.email]),
      ice_partenaire: new FormControl(null, [Validators.maxLength(15), Validators.minLength(15)]),
      id_ville: new FormControl(null),
      autorisation_partenaire: new FormControl(environment.liste_autorisations[0].value),
      type_societe_partenaire: new FormControl(null),
      fax_partenaire: new FormControl(null),
      registre_commerce_partenaire: new FormControl(null),
      identifiant_fiscal_partenaire: new FormControl(null),
      rib_partenaire: new FormControl(null),
      adresse_partenaire: new FormControl(null),
      responsable_nom_complet: new FormControl(null),
      responsable_telephone: new FormControl(null),
      responsable_email: new FormControl(null),
      description: new FormControl(null)
    });
  }

  ngOnInit(): void {
    if (this.action == 'modifier' && this.data_partenaire) // cas de la modification
    {
      this.Buttontext = "Modifier";
      this.DataBinding();
    }
    else // cas de l'ajout
    {
      this.LoadParamsForList();
      this.Buttontext = "Ajouter";
      this.FormmulairePartenaire.get('_id').setValue(0);
      setTimeout(() => {
        this.is_loading = false;
      }, 100);
    }
  }

  LoadParamsForList(id_ville: any = null) {
    this.afficher_params = this.apiGeneralService
    .LoadParamsForList({villes: true})
      .subscribe((res: any) => {
        if (res.hasOwnProperty('api_message') && res?.["api_message"] == "success") {
          new Promise((resolve) => {
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
            resolve({ id_ville: id_ville });
          }).then((value: any) => {
            this.FormmulairePartenaire.get('id_ville').setValue(value?.id_ville);
            this.is_loading = false;
          }).catch(() => {
            this.is_loading = false;
          });
        }
        else {
          this.generalService.errorSwal("Oups quelque chose a mal tourné au niveau du serveur !");
          this.is_loading = false;
        }
      }, () => { this.is_loading = false; });
  }

  /* -------------------------------------------------------------------------- */
  /*                       Les fonctions d'initialisation                       */
  /* -------------------------------------------------------------------------- */
  DataBinding() {
    /* ---------------------------- bind data to form --------------------------- */
    this.LoadParamsForList(this.data_partenaire?.id_ville);
    let controls: any[] =
      [
        '_id',
        "autorisation_partenaire",
        "libelle_partenaire",
        "telephone_partenaire",
        "fax_partenaire",
        "email_partenaire",
        "ice_partenaire",
        'type_societe_partenaire',
        "registre_commerce_partenaire",
        "identifiant_fiscal_partenaire",
        'rib_partenaire',
        "adresse_partenaire",
        "responsable_nom_complet",
        "responsable_telephone",
        "responsable_email",
        "description"
      ];
    controls.forEach(element => {
      this.FormmulairePartenaire.get(element).setValue(this.data_partenaire.hasOwnProperty(element) ? this.data_partenaire[element] : null);
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                             Gestion des erreurs                            */
  /* -------------------------------------------------------------------------- */
  error(message: any, if_speak: boolean = true) {
    this.messageService.add({ severity: 'error', detail: message });
    if (if_speak) { this.generalService.Speak(message); }
    this.is_loading = false;
    this.Disabled = false;
  }

  /* -------------------------------------------------------------------------- */
  /*                    Les fonctions d'ajout et modification                   */
  /* -------------------------------------------------------------------------- */
  /* ------------------------ Lors du click sur valider ----------------------- */
  SubmitForm() {
    this.IsFiled = true;
    if (this.FormmulairePartenaire.valid) {
      this.is_loading = true;
      this.Disabled = true;
      (this.action == "modifier" && this.data_partenaire) ? this.CallApiModifier() : this.CallApiAjouter();
    }
    else {
      this.error("Formulaire invalide !");
    }
  }

  CallApiAjouter() {
    this.Ajouter = this.partenairesService.AjouterPartenaire(this.FormmulairePartenaire.value)
      .subscribe((r: any) => {
        switch (r?.['api_message']) {
          case "ajouter":
            this.messageService.add({ severity: 'success', detail: "Partenaire ajouté !" });
            this.generalService.Speak('Partenaire ajouté');
            this.ClosePopUp();
            break;
          case "deleted":
            this.is_loading = false;
            this.handle_exicting(r?.['id_partenaire']);
            break;
          case "existant":
            this.error("Partenaire existant !");
            break;
          case "ice_existant":
            this.error("I.C.E partenaire existant !");
            break;
          case "non_ajouter":
            this.error("Oups quelque chose a mal tourné au niveau du serveur, partenaire non ajouté !");
            break;
          case "erreur":
            this.error("Oups quelque chose a mal tourné au niveau du serveur !");
            break;
          case "erreur_de_parametres":
            this.error("Erreur de paramètres !");
            break;
          default:
            this.error("Oups quelque chose a mal tourné au niveau du serveur !");
            break;
        }
      }, () => {
        this.error("Oups quelque chose a mal tourné au niveau du serveur !");
      });// fin subscribe
  }

  CallApiModifier() {
    this.Modifier = this.partenairesService.ModifierPartenaire(this.FormmulairePartenaire.value)
      .subscribe((r: any) => {
        switch (r?.['api_message']) {
          case "existant":
            this.error('Erreur : tentative de duplication des données');
            break;
          case "deleted":
            this.is_loading = false;
            this.handle_exicting(r?.['id_partenaire']);
            break;
          case "modifier":
            this.messageService.add({ severity: 'success', detail: "Partenaire modifié !" });
            this.generalService.Speak('Partenaire modifié');
            this.ClosePopUp();
            break;
          case "ice_existant":
            this.error("I.C.E partenaire existant !");
            break;
          case "non_modifier":
            this.error("Oups quelque chose a mal tourné au niveau du serveur, partenaire non modifié !");
            break;
          case "erreur":
            this.error("Oups quelque chose a mal tourné au niveau du serveur !");
            break;
          case "erreur_de_parametres":
            this.error("Erreur de paramètres !");
            break;
          default:
            this.error("Oups quelque chose a mal tourné au niveau du serveur !");
            break;
        }
      }, () => {
        this.error("Oups quelque chose a mal tourné au niveau du serveur !");
      });// fin subscribe
  }

  /* ---------------- En cas d'un Partenaire existant et supprimé --------------- */
  handle_exicting(id_partenaire: any) {
    Swal.fire({
      title: "Information",
      html:
        `<b>Ce partenaire a été récemment supprimé, voulez-vous le restaurer ?`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      cancelButtonText: "Annuler",
      confirmButtonColor: "#258662",
      cancelButtonColor: "#f50707",
      confirmButtonText: "Valider"
    }).then((result: any) => {
      if (result?.value) {
        this.is_loading = true;
        this.Restaurer = this.partenairesService.RestaurerPartenaire({ id_partenaire: id_partenaire })
          .subscribe((r: any) => {
            switch (r?.["api_message"]) {
              case "erreur_de_parametres":
                this.error("Erreur aucun identifiant n'a été fourni");
                break;
              case "success":
                this.messageService.add({ severity: 'success', detail: "Partenaire restauré !" });
                this.generalService.Speak('Partenaire restauré');
                this.ClosePopUp();
                break;
              case "non_restaurer":
                this.error('Oups quelque chose a mal tourné au niveau de l\'api !');
                break;
              case "erreur":
                this.error("Oups quelque chose a mal tourné au niveau du serveur !");
                break;
              default:
                this.error("Oups quelque chose a mal tourné au niveau du serveur !");
                break;
            }
          }, () => { this.error("Oups quelque chose a mal tourné au niveau du serveur !"); }); // fin subscribe
      } // fin if result swal
      else {
        this.error("Ce partenaire a été récemment supprimé !");
      }
    }); // fin then swal
  }

  /* ----------------------------- Fermer le popup ---------------------------- */
  ClosePopUp() {
    this.FermerPopUp.emit();
  }

  /* -- Lors de la destruction du composant pour ne pas avoir les memories leaks --*/
  ngOnDestroy(): void {
    let unsubscribe_liste: any[] = [
      this.Ajouter,
      this.Modifier,
      this.afficher_params,
      this.Restaurer
    ];
    unsubscribe_liste.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}