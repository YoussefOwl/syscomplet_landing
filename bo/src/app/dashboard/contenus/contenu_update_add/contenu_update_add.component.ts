import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { GeneralService, ContenusService, ApiGeneralService } from 'src/app/services/services';

@Component({
  selector: 'app-formulaire-update-add-contenu',
  templateUrl: './contenu_update_add.component.html'
})
export class ModifierAjouterContenuComponent implements OnInit {

  /* ------------------------------ Les variables globales ----------------------------- */
  Modifier: Subscription;
  Ajouter: Subscription;
  Afficher_params: Subscription;
  @Output('FermerPopUp') FermerPopUp = new EventEmitter<boolean>();
  @Input("data_contenu") data_contenu: any; // les données de la ligne en cas de modification
  is_loading: boolean = true;
  /* ----------------------- les variables du formulaire ---------------------- */
  FormmulaireContenu: FormGroup;
  IsFiled: boolean = false;
  Buttontext: any;
  Editor = this.generalService.Editor;
  config = this.generalService.config;
  /* ---------------------------------- liste --------------------------------- */
  liste_page_positions:any [] = [];
  liste_pages:any [] = [];

  constructor(
    private messageService: MessageService,
    public generalService: GeneralService,
    private apiGeneralService:ApiGeneralService,
    private contenus_service: ContenusService) {
    /* ---------------------- Initialisation du formulaire ---------------------- */
    this.FormmulaireContenu = new FormGroup({
      /* ---------------------------- Les champs requis --------------------------- */
      _id: new FormControl(null, Validators.required),
      html_id: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      description_fr: new FormControl(null,  Validators.minLength(10)),
      page: new FormControl(null, Validators.required),
      page_position: new FormControl(null, Validators.required),
      class: new FormControl(null),
      autre: new FormControl(null),
      description_ar: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.LoadParamsForList();
  }

  LoadParamsForList() {
    this.Afficher_params = this.apiGeneralService.LoadParamsForList({ pages : true, page_positions: true })
    .subscribe({
      next: (res:any)=> {
        if(res?.api_message === "success") {
          this.liste_page_positions = res?.liste_page_positions || [];
          this.liste_pages = res?.liste_pages || [];
        }
        if (this.data_contenu) {
          this.Buttontext = "Modifier";
          this.iniData();
          setTimeout(() => { this.is_loading = false; }, 500);
        }
        else {
          this.Buttontext = "Ajouter";
          this.FormmulaireContenu.get('_id').setValue(0);
          setTimeout(() => { this.is_loading = false; }, 500);
        }
      },
      complete:()=> {
        this.is_loading = false;
      }
    })
  }

  iniData() {
    Object.keys(this.FormmulaireContenu.value)
    .forEach((element: string) => {
      this.FormmulaireContenu.get(element).setValue(this.data_contenu?.[element] || null);  
    });
  }

  /* --------------------------- Gestion des erreurs -------------------------- */
  error(message: any, if_speak: boolean = true) {
    this.messageService.add({ severity: 'error', detail: message });
    if (if_speak) { this.generalService.Speak(message); }
    this.is_loading = false;
  }

  /* ------------------------ Lors du click sur valider ----------------------- */
  SubmitForm() {
    this.IsFiled = true;
    if (this.FormmulaireContenu.valid) {
      this.is_loading = true;
      this.data_contenu ? this.CallApiModifier() : this.CallApiAjouter();
    }
    else {
      this.error("Formulaire invalide !");
    }
  }

  CallApiModifier() {
    this.Modifier = this.contenus_service.ModifierContenu(
      {
        _id: this.FormmulaireContenu.value._id,
        html_id: this.FormmulaireContenu.value.html_id,
        description_fr: this.generalService.removeEmptyTags(this.FormmulaireContenu.value.description_fr),
        description_ar: this.generalService.removeEmptyTags(this.FormmulaireContenu.value.description_ar),
        page: this.FormmulaireContenu.value.page,
        page_position: this.FormmulaireContenu.value.page_position,
        class: this.FormmulaireContenu.value.class,
        autre: this.FormmulaireContenu.value.autre,
      }
    ).subscribe({
      next: (r: any) => {
        switch (r?.['api_message']) {
          case "modifier":
            this.messageService.add({ severity: 'success', detail: "Contenu modifié" });
            this.generalService.Speak('Contenu modifié');
            setTimeout(() => { this.ClosePopUp(); }, 2000);
            break;
          case "existant":
            this.error('Erreur : tentative de duplication des données');
            break;
          case "non_modifier":
            this.error("Oups quelque chose a mal tourné ...");
            break;
          case "erreur":
            this.error("Oups quelque chose a mal tourné ...");
            break;
          case "erreur_de_parametres":
            this.error("Erreur de paramètres !");
            break;
          default:
            this.error("Oups quelque chose a mal tourné ...");
            break;
        }
      },
      error: () => {
        this.is_loading = false;
      }
    });
  }

  CallApiAjouter() {
    this.Modifier = this.contenus_service.AjouterContenus(
      {
        _id: this.FormmulaireContenu.value._id,
        html_id: this.FormmulaireContenu.value.html_id,
        description_fr: this.generalService.removeEmptyTags(this.FormmulaireContenu.value.description_fr),
        description_ar: this.generalService.removeEmptyTags(this.FormmulaireContenu.value.description_ar),
        page: this.FormmulaireContenu.value.page,
        page_position: this.FormmulaireContenu.value.page_position,
        class: this.FormmulaireContenu.value.class,
        autre: this.FormmulaireContenu.value.autre,
      }
    ).subscribe({
      next: (r: any) => {
        switch (r?.['api_message']) {
          case "ajouter":
            this.messageService.add({ severity: 'success', detail: "Contenu ajouté" });
            this.generalService.Speak('Contenu ajouté');
            setTimeout(() => { this.ClosePopUp(); }, 2000);
            break;
          case "existant":
            this.error('Erreur : tentative de duplication des données');
            break;
          case "non_ajouter":
            this.error("Oups quelque chose a mal tourné ...");
            break;
          case "erreur":
            this.error("Oups quelque chose a mal tourné ...");
            break;
          case "erreur_de_parametres":
            this.error("Erreur de paramètres !");
            break;
          default:
            this.error("Oups quelque chose a mal tourné ...");
            break;
        }
      },
      error: () => {
        this.is_loading = false;
      }
    });
  }

  /* ----------------------------- Fermer le popup ---------------------------- */
  ClosePopUp() {
    this.FermerPopUp.emit();
  }

  /* -- Lors de la destruction du composant pour ne pas avoir les memories leaks --*/
  ngOnDestroy(): void {
    this.Afficher_params?.unsubscribe();
    this.Modifier?.unsubscribe();
    this.Ajouter?.unsubscribe();
  }
}