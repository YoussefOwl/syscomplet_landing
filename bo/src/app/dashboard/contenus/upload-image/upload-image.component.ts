import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeneralService, ContenusService } from 'src/app/services/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html'
})
export class UploadImageComponent {
  is_loading: boolean;
  Manage:Subscription;
  Supprimer:Subscription;
  @Input('dataItem') dataItem: any;
  @Output("FermerPopUp") FermerPopUp = new EventEmitter<boolean>();
  max_val_accepted: number = 10000000;
  accept_format: any = environment.liste_multimedias_type
  .filter((res: any) => [1].includes(res.value))
  .map(item => item.allowed)
  .join(',');

  constructor(
    protected generalService:GeneralService,
    private contenus_service: ContenusService
  ) {}

  /* -------------------------------------------------------------------------- */
  /*                                   upload                                   */
  /* -------------------------------------------------------------------------- */
  handelDataAndFile(copie_multimedia:any) {
    copie_multimedia = copie_multimedia?.currentFiles;
    let formData = new FormData();
    if (copie_multimedia?.length > 0) {
      if (copie_multimedia[0].size > this.max_val_accepted) {
        this.generalService.sweetAlert2("Le fichier est volumineux", "Le fichier est volumineux (" + (Number(copie_multimedia[0].size) / this.max_val_accepted).toFixed(2) + " Mo), le maximum est 10 Mo", 'simple', 'error', null, 1);
      }
      else {
        const reader = new FileReader();
        reader.readAsDataURL(copie_multimedia[0]); // Conversion du fichier en BASE64
        reader.onload = () => {
          Promise.resolve()
          .then(() => {
            formData.append('_id', this.dataItem?._id);
            formData.append('copie_multimedia', String(reader?.result)); // image  en binaire
            formData.append('file_extension', copie_multimedia[0].name.split('.').pop());
          })
          .then(()=> this.ManageImage(formData))
        }
      }
    }
    else this.generalService.errorSwal("Formulaire invalide !");
  }

  ManageImage(data:any) {
    this.is_loading = true;
    this.Manage = this.contenus_service.ManageImage(data)
    .subscribe({
      next: (res:any)=>{
        switch (res?.api_message) {
          case "success":
            this.generalService
            .sweetAlert2('Image ajoutée avec succès', null, 'simple', 'success')
            .then(()=> this.ClosePopUp(false));
            break;
          case "erreur_de_parametres":
            this.generalService.errorSwal("Erreur de paramètres !");
            break;
          default:
            this.generalService.errorSwal("Oups quelque chose a mal tourné !");
            break;
        }
      }, complete: ()=>{
        this.is_loading = false;
      }
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   delete                                   */
  /* -------------------------------------------------------------------------- */
  onDelete() {
    this.generalService.sweetAlert2("Voulez-vous supprimer cette image ?", null, "confirm", "question")
    .then((res: any) => {
      if (res?.isConfirmed) this.SupprimerImage();
    })
  }

  SupprimerImage() {
    this.is_loading = true;
    this.Supprimer = this.contenus_service.SupprimerImage({_id: this.dataItem?._id})
    .subscribe({
      next: (res: any) => {
        switch (res?.api_message) {
          case 'success':
            this.generalService.sweetAlert2('Image supprimée', null, 'simple', 'success')
            .then(() => this.ClosePopUp(false));
            break;
          case "erreur_de_parametres":
            this.generalService.errorSwal("Erreur de paramètres !");
            break;
          default:
            this.generalService.errorSwal("Oups quelque chose a mal tourné !");
            break;
        }
      },
      complete: () => {
        this.is_loading = false;
      }
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
    this.Manage?.unsubscribe();
    this.Supprimer?.unsubscribe();
  }
}
