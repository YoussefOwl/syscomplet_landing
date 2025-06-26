import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FournisseurService } from 'src/app/services/fournisseurs/fournisseur.service';
import { GeneralService } from 'src/app/services/services';

@Component({
  selector: 'app-update-fournisseur',
  templateUrl: './update-fournisseur.component.html'
})
export class UpdateFournisseurComponent {
  @Input('dataItem') dataItem: any;
  @Output("FermerPopUp") FermerPopUp = new EventEmitter<boolean>();
  is_loading: boolean;
  /* ------------------------------ subscriptions ----------------------------- */
  Modifier: Subscription;
  /* ---------------------------------- forms --------------------------------- */
  Formulaire: FormGroup;

  constructor(
    public generalService: GeneralService,
    private fournisseurService:FournisseurService,
  ) {
    this.Formulaire = new FormGroup({
      _id: new FormControl(null, Validators.required),
      libelle_fournisseur: new FormControl(null, Validators.required),
      description: new FormControl(null),
    })
  }

  ngOnInit() {
    this.iniData();
  }

  iniData() {
    Object.keys(this.Formulaire.value)
    .forEach((element: string) => {
      this.Formulaire.get(element).setValue(this.dataItem?.[element] || null);  
    });
  }

  onSubmit(){
    if (this.Formulaire.valid) {
      this.ModifierFournisseur();
    } else {
      this.generalService.sweetAlert2("Veuillez remplir tous les champs obligatoires", null, 'simple', 'error');
    }
  }

  ModifierFournisseur() {
    this.is_loading = true;
    this.Modifier = this.fournisseurService.ModifierFournisseur(this.Formulaire.value)
    .subscribe({
      next: (res:any)=> {
        switch(res?.api_message) {
          case "success":
            this.generalService
            .sweetAlert2('Fournisseur modifiée avec succès', null, 'simple', 'success')
            .then(()=> this.ClosePopUp(false));
            break;
          case "error_update":
            this.generalService.sweetAlert2(res?.title, null, 'simple', 'error','noTime')
            break;
          case "erreur_de_parametres":
            this.generalService.errorSwal("Erreur de paramètres !");
            break;
          case "error":
            this.generalService.errorSwal("Oups quelque chose a mal tourné !");
            break;
        }
      },
      complete: ()=> this.is_loading = false
    });
  }

  /* ---------------------------------- close --------------------------------- */
  ClosePopUp(if_show_confirm: boolean = true) {
    if (if_show_confirm) {
      this.generalService.sweetAlert2('Confirmation', "Êtes-vous certain(e) de vouloir fermer le formulaire ?", 'confirm', 'question')
      .then((res: any) => {
        if (res?.isConfirmed) this.FermerPopUp.emit();
      });
    }
    else this.FermerPopUp.emit();
  }

  ngOnDestroy() {
    this.Modifier?.unsubscribe();
  }
}
