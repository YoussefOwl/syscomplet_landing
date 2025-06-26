import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeneralService, UserService, ApiGeneralService } from 'src/app/services/services';
import { FileUpload } from 'primeng/fileupload';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { PusherService } from 'src/app/services/general/pusher.service';

@Component({
  selector: 'app-image-profile',
  templateUrl: './image_profile.component.html',
  styleUrls: ['../shared.compte.component.scss']
})
export class ImageProfileComponent implements OnInit {

  /* ----------------------- les variables globales ----------------------- */
  is_loading: boolean = true;
  Afficher_image: Subscription;
  Telecharger_image: Subscription;
  Supprimer_image: Subscription;
  Modifier_image: Subscription;
  @Output('FermerPopUp') FermerPopUp = new EventEmitter<boolean>();
  @Input("id_user") id_user: string; // identifiant d'utilisateur
  @Input("image") image: string; // image d'utilisateur
  @Input("source") source: string; // source soit le composant est utilisé par (administration) soit (utilisateur)
  /* ------------------------- les variables de l'image ------------------------ */
  image_user: any = null;
  image_user_path: any = null;
  IfNewImage: boolean = false;
  @ViewChild('copie_image') copie_image: FileUpload; // pour la récupération binnaire
  Ifmessage: boolean = false;
  ApiMessage: any;
  Disabled: boolean = false;
  Error: any = 0;

  constructor(
    public generalService: GeneralService,
    private pusherService: PusherService,
    private ApiGeneralService: ApiGeneralService,
    private UserService: UserService) { }

  ngOnInit(): void {
    /* --------------------------- Si il y'a une image -------------------------- */
    this.InitImage();
  }

  ClosePopUp() {
    this.FermerPopUp.emit();
  }

  InitImage() {
    this.image ? this.InitContent(this.image) : this.is_loading = false;
  }

  InitContent(image_user_path: any) {
    /* ---------------------- Traitements d'initialisation ---------------------- */
    this.image_user_path = image_user_path ? image_user_path : null;
    this.copie_image ? this.copie_image.clear() : null;
    this.image_user = null;
    this.IfNewImage = false;
    let body: any = {
      image_user_path: image_user_path,
      id_user: this.id_user
    };
    /* ------------------- Chargement de l'image depuis l'api ------------------- */
    this.Afficher_image = this.UserService.AfficherMonImage(body)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('api_message') && res?.["api_message"] == "success") {
          this.image_user_path = image_user_path;
          this.image_user = res.hasOwnProperty('image_user') ? res?.['image_user'] : null;
          this.is_loading = false;
        }
        else {
          this.generalService.errorSwal("Oups quelque chose a mal tourné");
          this.is_loading = false;
        }
      }, () => { this.is_loading = false; });
  }

  TelechargerImage(saved_file_name: any) {
    this.is_loading = true;
    let body: any = {
      fileName: saved_file_name,
      from: "profile"
    };
    this.Telecharger_image = this.ApiGeneralService.TelechargerDocument(body)
      .subscribe((res: any) => {
        FileSaver.saveAs(res, saved_file_name);
        this.is_loading = false;
      }, () => {
        this.generalService.errorSwal('Erreur fichier non existant sur le serveur...');
        this.is_loading = false;
      });// end subscribe
  }

  paramError(message: any, duration: number, type: number) {
    this.Disabled = false;
    this.is_loading = false;
    this.Error = type;
    this.ApiMessage = message;
    this.Ifmessage = true;
    setTimeout(() => {
      this.Ifmessage = false;
    }, duration);
  }

  SupprimerMonImage() {
    Swal.fire({
      title: "Suppression",
      html: `<b> Êtes-vous sûr de vouloir supprimer l'image du profile ?  </b>`,
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
          image_user_path: this.image_user_path,
          id_user: this.id_user
        };
        this.is_loading = true;
        this.Disabled = true;
        this.Supprimer_image = this.UserService.SupprimerMonImage(body)
          .subscribe((res: any) => {
            if (res.hasOwnProperty('api_message') && res?.["api_message"] == "success") {
              this.image_user_path = null; // vidage de la variable
              /* ------- Si c'est un utilisateur connécté qui met à jour son profile ------ */
              if (this.source == 'utilisateur') {
                this.paramError('Image de profile supprimée', 2000, 0); // affichage du message succès
                /* ---mise à jour de la session on supprime l'image si c'est le même individu -- */
                localStorage.removeItem('image_user_path');
                this.update_sidebar(false);
              }
              else // un administrateur qui gére et modifié des utlisateurs
              {
                this.is_loading = false;
                this.Error = 0;
                this.ApiMessage = 'Image de profile mise à jour';
                this.Ifmessage = true;
                setTimeout(() => {
                  this.ClosePopUp();
                }, 100);
              }
            }
            else {
              this.paramError('Oups quelque chose a mal tourné', 2000, 1);
              this.is_loading = false;
            }
          }, () => { this.is_loading = false; this.Disabled = false; });
      } // fin if result swal
    }); // fin then swal
  }

  /* ------------------ Vérification de la taille de l'image ------------------ */
  VerifyLengthFile(file_length: any, max: any, max_string: any) {
    if (file_length > max) {
      let message: any = `L'image est volumineuse (${(Number(file_length) / 1000000).toFixed(2)}) Mo, le maximum est : ${max_string} !`
      this.paramError(message, 2000, 1);
      return false;
    }
    else {
      return true;
    }
  }

  /* ---------------- Modification de l'image par une nouvelle ---------------- */
  ModifierMonImage(copie_image: any) {
    /* ------------------------ Déclaration des variables ----------------------- */
    let formData = new FormData();
    this.is_loading = true;
    this.Disabled = true;
    let if_image_valide: boolean = (copie_image.length > 0 && this.VerifyLengthFile(copie_image[0].size, 2000000, "2 Mo")) ? true : false;
    formData.append('id_user', this.id_user);
    /* ---------------------------  Gestion de l'image --------------------------- */
    if (if_image_valide) // En cas d'ajout d'une image
    {
      /* -------------------- Création des paramètres à envoyer ------------------- */
      formData.append('copie_image', copie_image[0]); // image en binaire
      formData.append('extention_copie_image', copie_image[0].name.split('.').pop());
      formData.append('image_old', this.image_user_path);
      this.CallApiUpload(formData); // appel à l'api
    }
    else {
      this.generalService.errorSwal('Formulaire invalide !');
      this.generalService.Speak('Formulaire invalide !');
      this.is_loading = false;
      this.Disabled = false;
    }
  }

  CallApiUpload(formData: any) {
    this.Modifier_image = this.UserService.ModifierMonImage(formData)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('api_message') && res?.["api_message"] == "success") {
          /* ------- Si c'est un utilisateur connécté qui met à jour son profile ------ */
          if (this.source == 'utilisateur') {
            /* -------------------------- Si c'est bien uplodé -------------------------- */
            this.paramError('Image de profile mise à jour', 2000, 0);
            this.InitContent(res?.["image_user_path"]);
            let body: any =
              [
                {
                  key: "image_user_path",
                  value: res?.["image_user_path"]
                }
              ];
            this.generalService.set_data_to_session_crypted(body);
            setTimeout(() => {
              this.update_sidebar(true);
            }, 250);
          }
          /* ------------------ Un admin qui modifie des utlisateurs ------------------ */
          else {
            this.is_loading = false;
            this.Error = 0;
            this.ApiMessage = 'Image de profile mise à jour';
            this.Ifmessage = true;
            setTimeout(() => {
              this.ClosePopUp();
            }, 100);
          }
        }
        else {
          this.paramError('Erreur serveur', 2000, 1);
          this.is_loading = false;
          this.Disabled = false;
        }
      }, () => { this.is_loading = false; this.Disabled = false; });
  }

  update_sidebar(state: boolean) {
    if (this.source == 'utilisateur') {
      setTimeout(() => {
        this.pusherService.FunctionSidebar(state); // mise à jour de l'image sur le sidebar
      }, 100);
    }
  }

  ngOnDestroy(): void {
    let unsubscribe_liste: any = [
      this.Supprimer_image,
      this.Modifier_image,
      this.Afficher_image,
      this.Telecharger_image
    ];
    unsubscribe_liste.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}