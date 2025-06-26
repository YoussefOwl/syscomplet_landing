import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralService, UserService } from 'src/app/services/services';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['../shared.compte.component.scss']
})
export class PasswordComponent implements OnInit {

  /* ----------------------- les variables ----------------------- */
  is_loading: boolean = true;
  Modifier: Subscription;
  FormmulairePassword: FormGroup;
  IsFiled: boolean = false;
  Disabled: boolean = false;
  @Input("id_user") id_user: string; // identifiant d'utilisateur
  @Input("source") source: string = null;
  @Output('FermerPopUp') FermerPopUp = new EventEmitter<boolean>();

  constructor(
    public generalService: GeneralService,
    private messageService: MessageService,
    private UserService: UserService) {
    /* ---------------------- Initialisation du formulaire ---------------------- */
    this.FormmulairePassword = new FormGroup({
      new_password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ]),
      re_new_password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ])
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.is_loading = false;
    }, 500);
  }

  ClosePopUp() {
    this.FermerPopUp.emit();
  }

  ChangePassword() {
    this.IsFiled = true;
    if (this.FormmulairePassword.valid) {
      if (this.FormmulairePassword.value.new_password == this.FormmulairePassword.value.re_new_password) {
        let body: any = {
          new_password: this.FormmulairePassword.value.new_password,
          id_user: this.id_user
        };
        this.is_loading = true;
        this.Disabled = true;
        this.Modifier = this.UserService.ChangePassword(body)
          .subscribe((r: any) => {
            switch (r?.api_message) {
              case "erreur_de_parametres":
                this.error("Erreur de paramètres !");
                break;
              case "updated":
                this.IsFiled = false;
                this.success('Mot de passe modifié !');
                break;
              case "not_updated":
                this.error('Erreur de modification ...');
                break;
              case "erreur":
                this.error("Erreur de modification ... ");
                break;
            }
          }, () => {
            this.is_loading = false;
            this.Disabled = false;
          });
      }
      else {
        this.error("Les deux mots de passes ne correspondent pas !");
      }
    }
    else {
      this.error("Formulaire invalide !");
    }
  }

  /* ------------------ Les fonctions de gestion des erreurs ------------------ */

  error(message: any, if_speak: boolean = true) {
    this.messageService.add({ severity: 'error', detail: message });
    if (if_speak) { this.generalService.Speak(message); }
    this.is_loading = false;
    this.Disabled = false;
  }

  success(message: any) {
    this.messageService.add({ severity: 'success', detail: message });
    this.generalService.Speak(message);
    if (this.source == 'administration') {
      this.ClosePopUp();
    }
    else {
      this.FormmulairePassword.reset();
      this.Disabled = false;
      this.is_loading = false;
    }
  }

  ngOnDestroy(): void {
    let unsubscribe_liste: any = [
      this.Modifier
    ];
    unsubscribe_liste.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}