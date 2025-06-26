import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { RoleService, GeneralService } from 'src/app/services/services';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
})

export class RolesComponent implements OnInit {

  /* ------------------------------ Les variables globales ----------------------------- */
  is_loading: boolean = true;
  afficher: Subscription;
  ajouter: Subscription;
  modifier: Subscription;
  afficher_excel: Subscription;
  /* ------------------------ les variables d'affichage ----------------------- */
  skip: any = 0;
  take: any = 50;
  order: any = "asc";
  colone: any = "id";
  totalRecords: any = 0;
  ListeRoles: any[] = [];
  FormmulaireRecherche: FormGroup;
  /* ---------------- les variables d'ajout et de modification ---------------- */
  FormmulaireRoles: FormGroup;
  IsFiled: boolean = false;
  if_show_dialog: boolean = false;
  Disabled: boolean = false;
  PanelHeader: any = "Ajouter un nouveau rôle";
  DialogHeader: any;
  if_can_manage_roles: boolean = false;

  constructor(
    public generalService: GeneralService,
    private messageService: MessageService,
    private RoleService: RoleService) {
    /* ---------------- Initialisation du formulaire de recherche ---------------- */
    this.FormmulaireRecherche = new FormGroup({
      libelle_role: new FormControl(null),
      description: new FormControl(null),
      acronym_role: new FormControl(null),
      sidebar: new FormControl(null),
    });
    /* ---------------- Initialisation du formulaire d'ajout et de modification ---------------- */
    this.FormmulaireRoles = new FormGroup({
      _id: new FormControl(null, Validators.required),
      libelle_role: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      acronym_role: new FormControl(null, Validators.required),
      sidebar: new FormControl(null, Validators.required),
      description: new FormControl(null)
    });
    /* -------------------------------------------------------------------------- */
    /*                          Gestion des interactions                          */
    /* -------------------------------------------------------------------------- */
    let id_role:any = this.generalService.GetCurrentRole();
    this.if_can_manage_roles = this.generalService.get_array_access_from_storage("if_can_manage_roles").includes(id_role)
    ? true
    : false;
  }

  ngOnInit(): void {
    /* ------------------------- Récupératio des données ------------------------ */
    this.AfficherRole();
  }

  /* -------------------------------------------------------------------------- */
  /*                       Les fonctions pour l'affichage                       */
  /* -------------------------------------------------------------------------- */

  ClearSearch() {
    this.FormmulaireRecherche.reset();
    this.Rechercher();
  }

  Rechercher() {
    this.skip = 0;
    this.take = 50;
    setTimeout(() => {
      this.AfficherRole();
    }, 100);
  }

  AfficherRole() {
    this.is_loading = true;
    let body: any = {
      colone: this.colone,
      order: this.order,
      skip: this.skip,
      take: this.take,
      libelle_role: this.FormmulaireRecherche.value.libelle_role,
      description: this.FormmulaireRecherche.value.description,
      acronym_role: this.FormmulaireRecherche.value.acronym_role,
      sidebar: this.FormmulaireRecherche.value.sidebar
    };
    this.afficher = this.RoleService.AfficherRole(body)
      .subscribe((r: any) => {
        if (r.hasOwnProperty('api_message') && (r?.api_message == "success")) {
          this.ListeRoles = r.hasOwnProperty('Data') ? r?.["Data"] : [];
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
      this.AfficherRole();
    }, 100);
  }

  Sort(event: any) {
    this.colone = event?.field
    this.order = (event?.order == -1) ? "desc" : "asc";
    setTimeout(() => {
      this.AfficherRole();
    }, 100);
  }

  exportToExcelOrCSV(type: any) {
    this.is_loading = true;
    let body: any = {
      if_excel: true,
      colone: this.colone,
      order: this.order,
      libelle_role: this.FormmulaireRecherche.value.libelle_role,
      description: this.FormmulaireRecherche.value.description,
      acronym_role: this.FormmulaireRecherche.value.acronym_role,
      sidebar: this.FormmulaireRecherche.value.sidebar
    };
    this.afficher_excel = this.RoleService.AfficherRole(body)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('api_message') && res?.["api_message"] == "success") {
          if (res?.Data.length > 0) {
            let myFormatedData: any[] = res?.["Data"].map((element: any) => (
              {
                'Libellé': element?.libelle_role,
                'Description': element?.description ? element?.description : '',
                'Menu': element?.sidebar ? JSON.stringify(element?.sidebar) : '',
                'Acronym': element?.acronym_role ? element?.acronym_role : '',
                'Date d\'ajout sur le système': element?.created_at_formated ? element?.created_at_formated : '',
                'Date de modification': element?.updated_at_formated ? element?.updated_at_formated : '',
              }
            ));
            if (type == "excel") {
              this.generalService.exportAsExcelFile(myFormatedData, 'liste_roles');
            }
            if (type == "csv") {
              this.generalService.exportAsCsvFile(myFormatedData, 'liste_roles');
            }
            this.is_loading = false;
          }
          else {
            this.generalService.errorSwal('Aucun rôle');
            this.is_loading = false;
          }
        }
        else {
          this.generalService.errorSwal("Oups quelque chose a mal tourné");
          this.is_loading = false;
        }
      }, () => {
        this.is_loading = false;
      });
  }

  /* ------------------------------ Add or update ----------------------------- */

  ShowUpdateAddRole(dataItem: any = null) {
    this.Disabled = false;
    setTimeout(() => {
      /* -------------------------------------------------------------------------- */
      /*                                Modification                                */
      /* -------------------------------------------------------------------------- */
      if (dataItem) {
        this.PanelHeader = "Modification du rôle : " + dataItem?.libelle_role;
        this.DialogHeader = "Modification";
        this.FormmulaireRoles.get('_id').setValue(dataItem.hasOwnProperty('_id') ? dataItem?.['_id'] : null);
        this.FormmulaireRoles.get('libelle_role').setValue(dataItem.hasOwnProperty('libelle_role') ? dataItem?.['libelle_role'] : null);
        this.FormmulaireRoles.get('description').setValue(dataItem.hasOwnProperty('description') ? dataItem?.['description'] : null);
        this.FormmulaireRoles.get('acronym_role').setValue(dataItem.hasOwnProperty('acronym_role') ? dataItem?.['acronym_role'] : null);
        this.FormmulaireRoles.get('sidebar').setValue(dataItem.hasOwnProperty('sidebar') ? JSON.stringify(dataItem?.['sidebar'], null, 2) : null);
        this.if_show_dialog = true;
        setTimeout(() => {
          this.is_loading = false;
        }, 250);
      }
      /* -------------------------------------------------------------------------- */
      /*                                    Ajout                                   */
      /* -------------------------------------------------------------------------- */
      else {
        new Promise((resolve) => {
          this.PanelHeader = "Ajouter un nouveau rôle";
          this.DialogHeader = "Formulaire d'ajout";
          this.FormmulaireRoles.reset(); // remet le formulaire à son état initiale
          resolve(0);
        }).then((value: any) => {
          this.FormmulaireRoles.get("_id").setValue(value);
          this.if_show_dialog = true;
          setTimeout(() => {
            this.is_loading = false;
          }, 250);
        });
      }
    }, 250);
  }

  SubmitFom() {
    this.IsFiled = true;
    if (this.FormmulaireRoles.valid) {
      /* ------------------------- Si c'est du json valid ------------------------- */
      if (this.generalService.isJson(this.FormmulaireRoles.value.sidebar)) {
        /* ------------------------- Si c'est array d'objets ------------------------ */
        if (Array.isArray(JSON.parse(this.FormmulaireRoles.value.sidebar))) {
          /* ----------------------- Si c'est la même structure ----------------------- */
          if (this.generalService.If_Dictionnary_has_Same_Structure(JSON.parse(this.FormmulaireRoles.value.sidebar))) {
            this.is_loading = true;
            this.Disabled = true;
            this.FormmulaireRoles.value._id == 0 ? this.CallApiAjouter() : this.CallApiModifier();
          }
          else {
            this.error("Sidebar menu invalide, veuillez entrer une liste JSON de même struture !");
          }
        }
        else {
          this.error("Sidebar menu invalide, veuillez entrer une liste !");
        }
      }
      else {
        this.error("Sidebar menu invalide, veuillez entrer des données sous format JSON !");
      }
    }
    else {
      this.error("Formulaire invalide !");
    }
  }

  CallApiAjouter() {
    this.ajouter = this.RoleService.AjouterRole(this.FormmulaireRoles.value)
      .subscribe((r: any) => {
        switch (r?.['api_message']) {
          case "ajouter":
            this.generalService.Speak("Rôle ajouté");
            this.messageService.add({ severity: 'success', detail: 'Rôle ajouté' });
            this.AfficherRole();
            setTimeout(() => {
              this.if_show_dialog = false;
            }, 2000);
            break;
          case "existant":
            this.error("Rôle existant");
            break;
          case "non_ajouter":
            this.error("Oups quelque chose a mal tourné : Rôle non ajouté");
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
      }, () => { this.is_loading = false; this.Disabled = false; });// end subscribe
  }

  CallApiModifier() {
    this.modifier = this.RoleService.ModifierRole(this.FormmulaireRoles.value)
      .subscribe((r: any) => {
        switch (r?.['api_message']) {
          case "modifier":
            this.generalService.Speak("Rôle modifié");
            this.messageService.add({ severity: 'success', detail: 'Rôle modifié' });
            this.AfficherRole();
            setTimeout(() => {
              this.if_show_dialog = false;
            }, 2000);
            break;
          case "non_modifier":
            this.error("Oups quelque chose a mal tourné : Rôle non modifié");
            break;
          case "existant":
            this.error('Erreur : tentative de duplication des données');
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
      }, () => { this.is_loading = false; this.Disabled = false; }
      );// end subscribe
  }

  error(message: any, if_speak: boolean = true) {
    this.messageService.add({ severity: 'error', detail: message });
    if (if_speak) { this.generalService.Speak(message); }
    this.is_loading = false;
    this.Disabled = false;
  }

  /* -- Lors de la destruction du composant pour ne pas avoir les memories leaks --*/

  ngOnDestroy(): void {
    let unsubscribeRole: any[] = [
      this.afficher,
      this.ajouter,
      this.modifier,
      this.afficher_excel
    ];
    unsubscribeRole.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}