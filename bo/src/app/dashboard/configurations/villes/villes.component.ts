import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import Swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { GeneralService, VilleService } from 'src/app/services/services';

@Component({
  selector: 'app-villes',
  templateUrl: './villes.component.html'
})
export class VillesComponent implements OnInit {
  /* ------------------------------ Les variables globales ----------------------------- */
  is_loading: boolean = true;
  afficher: Subscription;
  afficher_excel: Subscription;
  Ajouter: Subscription;
  Supprimer: Subscription;
  Modifier: Subscription;
  restaurer: Subscription;
  /* ------------------------ les variables d'affichage ----------------------- */
  skip: any = 0;
  take: any = 10;
  order: any = "asc";
  colone: any = "libelle_ville";
  totalRecords: any = 0;
  liste_villes: any[] = [];
  /* ------------------ les variables d'ajout et modification ----------------- */
  Formmulaire: FormGroup;
  IsFiled: boolean = false;
  if_show_dialog: boolean = false;
  Disabled: boolean = false;
  PanelHeader: any = "Ajout d'une nouvelle ville";

  constructor(
    public generalService: GeneralService,
    private messageService: MessageService,
    private villes_Service: VilleService) {
    /* ---------------------- Initialisation du formulaire ---------------------- */
    this.Formmulaire = new FormGroup({
      _id: new FormControl(null, Validators.required),
      libelle_ville: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      description: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.AfficherVille();
  }

  /* -------------------------------------------------------------------------- */
  /*                       Les fonctions pour l'affichage                       */
  /* -------------------------------------------------------------------------- */

  AfficherVille() {
    this.is_loading = true;
    let body: any = {
      colone: this.colone,
      order: this.order,
      skip: this.skip,
      take: this.take
    };
    this.afficher = this.villes_Service.AfficherVille(body)
      .subscribe((r: any) => {
        if (r?.api_message == "success") {
          this.liste_villes = r.hasOwnProperty('Data') ? r?.["Data"] : [];
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
      this.AfficherVille();
    }, 100);
  }

  Sort(event: any) {
    this.colone = event?.field
    this.order = (event?.order == -1) ? "desc" : "asc";
    setTimeout(() => {
      this.AfficherVille();
    }, 100);
  }

  exportToExcel() {
    this.is_loading = true;
    let body: any = {
      colone: this.colone,
      order: this.order,
      if_excel: true
    };
    this.afficher_excel = this.villes_Service.AfficherVille(body)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('api_message') && res?.["api_message"] == "success") {
          if (res?.Data.length > 0) {
            let myFormatedData: any[] = [];
            res?.["Data"].forEach((element: any) => {
              myFormatedData.push({
                'Libellé': element?.libelle_ville,
                'Description': element?.description ? element?.description : '',
                'Date d\'ajout sur le système': element?.created_at_formated ? element?.created_at_formated : '',
                'Date de modification': element?.updated_at_formated ? element?.updated_at_formated : ''
              });
            });
            setTimeout(() => {
              this.generalService.exportAsExcelFile(myFormatedData, 'Liste_des_villes');
              this.is_loading = false;
            }, 100);
          }
          else {
            this.generalService.errorSwal('Aucune ville');
            this.is_loading = false;
          }
        }
        else {
          this.generalService.errorSwal('Oups quelque chose a mal tourné au niveau du serveur ...');
          this.is_loading = false;
        }
      }, () => { this.is_loading = false; })
  }

  /* -------------------------------------------------------------------------- */
  /*                  Les fonction pour l'ajout et modifcation                  */
  /* -------------------------------------------------------------------------- */
  ShowFormulaire(action: any, data: any = null) {
    this.is_loading = true;
    this.Disabled = false;
    this.IsFiled = false;
    setTimeout(() => {
      if (action == "ajouter") // Ajout
      {
        new Promise((resolve) => {
          this.PanelHeader = "Ajout d'une nouvelle ville";
          this.Formmulaire.reset(); // remet le formulaire à son état initiale
          resolve(0);
        }).then((value: any) => {
          this.Formmulaire.get("_id").setValue(value);
          this.if_show_dialog = true;
          setTimeout(() => {
            this.is_loading = false;
          }, 250);
        });
      }
      else if (action == 'modifier') // Modification
      {
        this.PanelHeader = "Modification de la ville : " + data?.libelle_ville;
        let controls: any[] =
          [
            '_id',
            'libelle_ville',
            'description'
          ];
        controls.forEach((element: any) => {
          this.Formmulaire.get(element).setValue(data.hasOwnProperty(element) ? data[element] : null);
        });
        this.if_show_dialog = true;
        setTimeout(() => {
          this.is_loading = false;
        }, 250);
      }
    }, 250);
  }

  /* --------------------------- Gestion des erreurs -------------------------- */
  error(message: any, if_speak: boolean = true) {
    this.messageService.add({ severity: 'error', detail: message });
    if (if_speak) { this.generalService.Speak(message); }
    this.is_loading = false;
    this.Disabled = false;
  }

  AjouterModifierVille() {
    this.IsFiled = true;
    if (this.Formmulaire.valid) {
      this.is_loading = true;
      this.Disabled = true;
      this.Formmulaire.value._id == 0 ? this.CallApiAjouter() : this.CallApiModifier();
    }
    else {
      this.error("Formulaire invalide !");
    }
  }

  CallApiAjouter() {
    this.Ajouter = this.villes_Service.AjouterVille(this.Formmulaire.value)
      .subscribe((r: any) => {
        switch (r?.['api_message']) {
          case "ajouter":
            this.messageService.add({ severity: 'success', detail: "Ville ajoutée !" });
            this.generalService.Speak('Ville ajoutée');
            this.AfficherVille();
            setTimeout(() => {
              this.if_show_dialog = false;
              this.Disabled = false;
            }, 500);
            break;
          case "existant":
            this.error("Ville existante");
            break;
          case "non_ajouter":
            this.error("Oups quelque chose a mal tourné : Ville non ajoutée");
            break;
          case "erreur":
            this.error("Oups quelque chose a mal tourné au niveau du serveur ...");
            break;
          case "erreur_de_parametres":
            this.error("Erreur de paramètres !");
            break;
          case "deleted":
            this.is_loading = false;
            this.handle_exicting(r?.['id_ville']);
            break;
          default:
            this.error("Oups quelque chose a mal tourné au niveau du serveur ...");
            break;
        }
      }, () => { this.error("Oups quelque chose a mal tourné au niveau du serveur ...") });// end subscribe
  }

  CallApiModifier() {
    this.Modifier = this.villes_Service.ModifierVille(this.Formmulaire.value)
      .subscribe((r: any) => {
        switch (r?.['api_message']) {
          case "modifier":
            this.messageService.add({ severity: 'success', detail: "Ville modifiée !" });
            this.generalService.Speak('Ville modifiée');
            this.AfficherVille();
            setTimeout(() => {
              this.if_show_dialog = false;
              this.Disabled = false;
            }, 500);
            break;
          case "non_modifier":
            this.error("Oups quelque chose a mal tourné : Ville non modifié");
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
          case "deleted":
            this.is_loading = false;
            this.handle_exicting(r?.['id_ville']);
            break;
          default:
            this.error("Oups quelque chose a mal tourné au niveau du serveur ...");
            break;
        }
      }, () => { this.error("Oups quelque chose a mal tourné au niveau du serveur ...") }
      );// end subscribe
  }

  /* ----------------------- La fonction de suppression ----------------------- */
  SupprimerVille(dataItem: any) {
    Swal.fire({
      title: "Suppression",
      html:
        `<b>Êtes-vous sûr de vouloir supprimer la ville : </b></br>  ${dataItem?.libelle_ville} ?`,
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
          _id: dataItem?._id
        };
        this.is_loading = true;
        this.Supprimer = this.villes_Service.SupprimerVille(body)
          .subscribe((r: any) => {
            switch (r?.api_message) {
              case "erreur_de_parametres":
                this.generalService.errorSwal("Erreur de suppression aucun identifiant n'a été fourni");
                this.is_loading = false;
                break;
              case "supprimer":
                this.AfficherVille();
                this.generalService.errorSwal("Ville supprimée !", 2000, "success");
                break;
              case "non_supprimer":
                this.generalService.errorSwal('Erreur de suppression');
                this.is_loading = false;
                break;
              case "has_records":
                this.generalService.Speak("Suppression impossible, car la ville est liée à des transactions");
                Swal.fire({
                  icon: 'error',
                  width: 900,
                  title: "Suppression impossible, car la ville est liée à des transactions :",
                  html: `
                      <pre style="height: 200px !important;text-align: left;">
                      ${this.generalService.syntaxHighlight(r?.["related_records"])}
                      </pre> `,
                  showConfirmButton: true
                });
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
      } // if result swal
    }); // then swal
  }

  /* ---------------- En cas d'une ville existante et supprimée --------------- */
  handle_exicting(id_ville: any) {
    Swal.fire({
      title: "Information",
      html:
        `<b>Cette ville a été récemment supprimée, voulez-vous la restaurer ?`,
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
          id_ville: id_ville
        };
        this.is_loading = true;
        this.restaurer = this.villes_Service.RestaurerVille(body)
          .subscribe((r: any) => {
            switch (r?.["api_message"]) {
              case "erreur_de_parametres":
                this.error("Erreur aucun identifiant n'a été fourni");
                break;
              case "success":
                this.messageService.add({ severity: 'success', detail: "Ville restaurée !" });
                this.generalService.Speak('Ville restaurée');
                this.AfficherVille();
                setTimeout(() => {
                  this.if_show_dialog = false;
                  this.Disabled = false;
                }, 500);
                break;
              case "non_restaurer":
                this.error('Oups quelque chose a mal tourné au niveau de l\'api !');
                break;
              case "erreur":
                this.error("Oups quelque chose a mal tourné !");
                break;
              default:
                this.error("Oups quelque chose a mal tourné !");
                break;
            }
          }, () => { this.error("Oups quelque chose a mal tourné !"); }); // fin subscribe
      } // fin if result swal
      else {
        this.error("Cette ville a été récemment supprimée !");
      }
    }); // fin then swal
  }

  /* -- Lors de la destruction du composant pour ne pas avoir les memories leaks --*/
  ngOnDestroy(): void {
    let unsubscribe_liste: any[] = [
      this.afficher,
      this.Ajouter,
      this.Modifier,
      this.Supprimer,
      this.afficher_excel,
      this.restaurer
    ];
    unsubscribe_liste.forEach((element: any) => {
      if (element) {
        element?.unsubscribe();
      }
    });
  }
}