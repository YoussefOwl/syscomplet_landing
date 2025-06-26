import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeneralService, UserService } from 'src/app/services/services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PusherService } from 'src/app/services/general/pusher.service';
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['../shared.compte.component.scss']
})
export class InformationComponent implements OnInit {

  /* ----------------------- les variables globales ----------------------- */
  is_loading: boolean = true;
  Afficher_infos: Subscription;
  Update_info: Subscription;
  @Output('FermerPopUp') FermerPopUp = new EventEmitter<boolean>();
  @Input("id_user") id_user: string; // identifiant d'utilisateur
  @Input("source") source: string; // source soit le composant est utilisé par (administration) soit (utilisateur)
  /* ----------------------- les variables du formulaire ---------------------- */
  formmulaire_compte: FormGroup;
  IsFiled: boolean = false;
  Disabled: boolean = false;
  
  constructor(
    public generalService: GeneralService,
    private messageService: MessageService,
    private pusherService: PusherService,
    private UserService: UserService) {

    /* ---------------------- Initialisation du formulaire ---------------------- */
    this.formmulaire_compte = new FormGroup({
      id: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.minLength(10),
        Validators.maxLength(100),
        Validators.email,
        Validators.required
      ]),
      nom: new FormControl(null, [
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
      ]),
      prenom: new FormControl(null, [
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
      ])
    });
  }

  ngOnInit(): void {
    /* ------------- Appel aux fonction de récupération des données  en cas d'update ------------- */
    this.GetMyInfo();
  }

  ClosePopUp() {
    this.FermerPopUp.emit();
  }

  /* ----------------- Récupération des infomations du compte ----------------- */
  GetMyInfo() {
    this.Afficher_infos = this.UserService.GetMyInfo({id_user: this.id_user})
    .subscribe((res:any) => {
      if (res.hasOwnProperty('api_message') && res?.["api_message"] == "success") {
        /* --------- Data binding entre le formulaire et les données reçues --------- */
        this.formmulaire_compte.get('id').setValue(this.id_user); // id user crypté
        this.formmulaire_compte.get('nom').setValue(res?.['my_info'].nom);
        this.formmulaire_compte.get('prenom').setValue(res?.['my_info'].prenom);
        this.formmulaire_compte.get('email').setValue(res?.['my_info'].email);
        this.is_loading = false;
      }
      else {
        this.generalService.errorSwal("Oups quelque chose a mal tourné");
        this.is_loading = false;
      }
    }, () => { this.is_loading = false; })
  }

  /* ------------------ Les fonctions modification des infos du compte ------------------ */
 
  SubmitUpdate() {
    this.IsFiled = true;
    if (this.formmulaire_compte.valid) {
      this.is_loading = true;
      this.CallModifierUtilisateur();
    }
    else {
      this.error('Formulaire invalide !');
    }
  }

  /* ----- La fonction de modification des informations de compte ----- */
  CallModifierUtilisateur() {
    this.Disabled = true;
    this.Update_info = this.UserService.ModifierUtilisateur(this.formmulaire_compte.value)
    .subscribe((r:any) => {
      switch (r?.['api_message']) {
        case "modifier":
          this.success("Informations modifiées");
          break;
        case "existant":
          this.error("Erreur : l'email est déja existant !");
          break;
        case "non_modifier":
          this.error("Oups quelque chose a mal tourné : Informations non modifiées");
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
  error(message: any, if_speak: boolean = true) {
    this.messageService.add({ severity: 'error', detail: message });
    if (if_speak) { this.generalService.Speak(message); }
    this.is_loading = false;
    this.Disabled = false;
  }

  success(message: any) {
    this.messageService.add({ severity: 'success', detail: message });
    this.generalService.Speak(message);
    switch (this.source) {
      case 'utilisateur':
        this.Disabled = false;
        this.GetMyInfo();
        /* ------- Si c'est un utilisateur connécté qui met à jour son profile ------ */
        let data: any = {
          nom: this.formmulaire_compte.value.nom,
          prenom: this.formmulaire_compte.value.prenom
        };
        this.pusherService.FunctionSidebar_data(data); // mise à jour des infos user sur le sidebar
        break;
      case "administration":
        this.ClosePopUp();
        break;
    }
  }

  ngOnDestroy(): void {
    let unsubscribe_liste: any[] = [
      this.Afficher_infos,
      this.Update_info
    ];
    unsubscribe_liste.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}