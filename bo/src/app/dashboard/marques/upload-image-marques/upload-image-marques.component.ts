import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MarqueService } from 'src/app/services/marque/marque.service';
import { GeneralService } from 'src/app/services/services';

@Component({
  selector: 'app-upload-image-marques',
  templateUrl: './upload-image-marques.component.html',
})
export class UploadImageMarquesComponent {
  @Input('dataItem') dataItem: any;
  @Output('FermerPopUp') FermerPopUp = new EventEmitter<boolean>();
  is_loading: boolean = false;

  /* ------------------------------ Subscriptions ----------------------------- */
  Upload: Subscription;

  /* ------------------------------ Configurations ----------------------------- */
  max_val_accepted: number = 10000000; // 10 MB
  accept_format: string = '.jpg,.jpeg,.png,.gif';

  constructor(
    private marqueService: MarqueService,
    protected generalService: GeneralService
  ) {}

  handleFileUpload(copie_multimedia: any) {
    copie_multimedia = copie_multimedia?.currentFiles;
    let formData = new FormData();
    if (copie_multimedia?.length > 0) {
      if (copie_multimedia[0].size > this.max_val_accepted) {
        this.generalService.sweetAlert2(
          'Le fichier est volumineux',
          'Le fichier est volumineux (' +
            (Number(copie_multimedia[0].size) / this.max_val_accepted).toFixed(
              2
            ) +
            ' Mo), le maximum est 10 Mo',
          'simple',
          'error',
          null,
          1
        );
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(copie_multimedia[0]); // Convert file to BASE64
        reader.onload = () => {
          Promise.resolve()
            .then(() => {
              formData.append('_id', this.dataItem?._id);
              formData.append('copie_multimedia', String(reader?.result)); // Image in binary
              formData.append(
                'file_extension',
                copie_multimedia[0].name.split('.').pop()
              );
            })
            .then(() => this.ManageLogo(formData));
        };
      }
    } else {
      this.generalService.errorSwal('Aucun fichier sélectionné !');
    }
  }

  ManageLogo(data: any) {
    this.is_loading = true;
    this.Upload = this.marqueService.ManageLogo(data).subscribe({
      next: (res: any) => {
        switch (res?.api_message) {
          case 'success':
            this.generalService
              .sweetAlert2(
                'Image téléchargée avec succès',
                null,
                'simple',
                'success'
              )
              .then(() => this.ClosePopUp(false));
            break;
          case 'file_error':
            this.generalService.sweetAlert2(
              'Erreur lors du téléchargement du fichier',
              null,
              'simple',
              'error'
            );
            break;
          case 'error':
            this.generalService.errorSwal('Oups, quelque chose a mal tourné !');
            break;
        }
      },
      complete: () => (this.is_loading = false),
    });
  }

  /* ---------------------------------- Close --------------------------------- */
  ClosePopUp(if_show_confirm: boolean = true) {
    if (if_show_confirm) {
      this.generalService
        .sweetAlert2(
          'Confirmation',
          'Êtes-vous certain(e) de vouloir fermer le formulaire ?',
          'confirm',
          'question'
        )
        .then((res: any) => {
          if (res?.isConfirmed) this.FermerPopUp.emit();
        });
    } else {
      this.FermerPopUp.emit();
    }
  }

  ngOnDestroy() {
    this.Upload?.unsubscribe();
  }
}
