import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';
import { GeneralService, ApiGeneralService, PartenairesService } from 'src/app/services/services';

@Component({
  selector: 'app-partenaire-image',
  templateUrl: './partenaire_image.component.html'
})
export class ImagePartenaireComponent implements OnInit {

  /* ------------------------------ Les variables ----------------------------- */
  @Input("data_partenaire") data_partenaire: any;
  @Output('FermerPopUp') FermerPopUp = new EventEmitter<boolean>();
  API_BASE_URL_STORAGE_PARTENAIRES: any = environment.API_BASE_URL_STORAGE_PARTENAIRES;
  is_loading: boolean = false;
  Telecharger: Subscription;
  ModifierImage: Subscription;
  SupprimerImage: Subscription;
  /* ------------------------ Les variables du formulaire ----------------------- */
  Ifmessage_logo: boolean = false;
  ApiMessage_logo: any;
  Disabled_logo: boolean = false;
  Error: any = 0;
  logo_chemin: any = null;
  IfNewImage: boolean = false;
  @ViewChild('copie_image_partenaire') copie_image_partenaire: FileUpload; // pour la récupération binnaire

  constructor(
    private partenairesService: PartenairesService,
    public generalService: GeneralService,
    private apiGeneralService: ApiGeneralService
  ) { }

  ngOnInit(): void {
    /* ----------------------------- Initialisations ---------------------------- */
    this.InitContent();
  }

  InitContent() {
    /* ---------------------- Traitements d'initialisation ---------------------- */
    this.logo_chemin = this.data_partenaire?.logo_partenaire;
    this.copie_image_partenaire ? this.copie_image_partenaire.clear() : null;
    this.IfNewImage = false;
    this.is_loading = false;
  }

  /* ----------------------------- Fermer le popup ---------------------------- */
  ClosePopUp() {
    this.FermerPopUp.emit();
  }

 /* ---------------- Paramétrage d'erreur via la balise alerte --------------- */
 paramError(message: any, duration: number, type: number,Disabled_logo:boolean=false) {
  this.Disabled_logo = Disabled_logo;
  this.is_loading = false;
  this.Error = type;
  this.ApiMessage_logo = message;
  this.Ifmessage_logo = true;
  setTimeout(() => {
    this.Ifmessage_logo = false;
  }, duration);
}

  ModifierImagePartenaire(copie_image_partenaire: any) {
    let formData = new FormData();
    if (copie_image_partenaire.length > 0) { // En cas d'ajout d'une image
      if (copie_image_partenaire[0].size > 2000000) // Taille du fichier supérieur à 2 mb
      {
        this.paramError("l'image est volumineuse (" + (Number(copie_image_partenaire[0].size) / 2000000).toFixed(2) + " Mo), le maximum est 2 Mo", 2000, 1);
      }
      else // le logo séléctionné est valide
      {
        formData.append('id_partenaire', this.data_partenaire?._id);// identifiant du partenaire
        formData.append('image_old', this.logo_chemin);
        formData.append('copie_image_partenaire', copie_image_partenaire[0]); // image  en binaire
        formData.append('extention_copie_image_partenaire', copie_image_partenaire[0].name.split('.').pop());
        this.CallApiUpload(formData);
      }
    }
    else {
      this.paramError('Aucune document séléctionné !', 2000, 1);
    }
  }

  CallApiUpload(formData: any) {
    this.is_loading = true;
    this.Disabled_logo = true;
    this.SupprimerImage = this.partenairesService.ModifierImagePartenaire(formData)
      .subscribe((res: any) => {
        if (res?.["api_message"] == "success") {
          this.is_loading = false;
          this.paramError("Le logo a été mise à jour !", 1500, 0, true);
          setTimeout(() => {
            this.ClosePopUp();
          }, 1600);
        }
        else {
          this.paramError('Oups quelque chose a mal tourné au niveau de l\'api !', 2000, 1);
          this.is_loading = false;
          this.Disabled_logo = false;
        }
      }, () => { this.is_loading = false; this.Disabled_logo = true; });
  }

  /* ------------------------ Télechargement d'un logo ------------------------ */
  TelechargerLogo(saved_file_name: any) {
    this.is_loading = true;
    let body: any = {
      fileName: saved_file_name,
      from: "partenaires",
      source: 'public'
    };
    this.Telecharger = this.apiGeneralService.TelechargerDocument(body)
      .subscribe((res: any) => {
        FileSaver.saveAs(res, saved_file_name);
        this.is_loading = false;
      }, () => {
        this.generalService.errorSwal('Erreur fichier non existant sur le serveur...');
        this.is_loading = false;
      });// fin subscribe
  }

  /* --------------------- Supprimer l'image -------------------- */
  SupprimerImagePartenaire(logo_chemin: any) {
    Swal.fire({
      title: "Suppression",
      html: `<b>Êtes-vous sûr de vouloir supprimer le logo du partenaire ? </b>`,
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
          logo_partenaire: logo_chemin,
          id_partenaire: this.data_partenaire?._id // identifiant du partenaire
        };
        this.is_loading = true;
        this.Disabled_logo = true;
        this.ModifierImage = this.partenairesService.SupprimerImagePartenaire(body)
          .subscribe((res: any) => {
            if (res?.["api_message"] == "success") {
              this.IfNewImage = true;
              this.paramError("Le logo a été supprimé !", 1500, 0,true);
              setTimeout(() => {  this.ClosePopUp();}, 1600);
            }
            else {
              this.paramError('Oups quelque chose a mal tourné au niveau de l\'api !', 2000, 1);
              this.is_loading = false;
            }
          }, () => { this.is_loading = false; this.Disabled_logo = true; });
      } // fin if result swal
    }); // fin then swal
  }

  /* -- Lors de la destruction du composant pour ne pas avoir les memories leaks --*/

  ngOnDestroy(): void {
    let unsubscribe_liste: any[] = [
      this.Telecharger,
      this.ModifierImage,
      this.SupprimerImage
    ];
    unsubscribe_liste.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}