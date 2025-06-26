import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from 'rxjs';
import { MessageService } from "primeng/api";
import { UserService, GeneralService } from "src/app/services/services";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: [
    "./login.component.scss",
    "../shared/loader/loader.component.scss"
  ]
})

export class LoginComponent implements OnInit {
  /* ---------------------------- Variables ---------------------------- */
  is_loading: boolean = true;
  Login: Subscription;
  FormulaireLogin: FormGroup;
  IsFiled: boolean = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    public generalService: GeneralService,
    private router: Router) {
    this.generalService.if_load = false; // suppression du loader
    /* ------------------ Initialisation du formulaire de login ----------------- */
    this.FormulaireLogin = new FormGroup({
      email: new FormControl(null, [
        Validators.minLength(10),
        Validators.maxLength(100),
        Validators.email,
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.required
      ]),
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.is_loading = false;
    }, 500);
  }

  LoginUtilisateur() {
    this.IsFiled = true;
    /* ----------------------- Si le formulaire est valide ---------------------- */
    if (this.FormulaireLogin.valid) {
      this.is_loading = true;
      this.userService.LoginUtilisateur({
        email: (this.FormulaireLogin.value.email).replace(/\s/g, ''), // removing spaces
        password: this.FormulaireLogin.value.password,
      }).subscribe({
        next: (r: any) => {
          switch (r?.api_message) {
            case "non_existant": {
              this.error("Email non existant");
              break;
            }
            case "deleted": {
              this.error("Compte supprimé, veuillez contactez le support merci");
              break;
            }
            case "valide": {
              if (r?.["id_role_crypted_front"] && r?.["auth_infos"]) {
                this.messageService.add({ severity: 'success', detail: "Authentification valide" });
                /* ---------------------- Pour voir la variable du son ---------------------- */
                for (let item of r?.["auth_infos"]) {
                  if (item?.key === 'if_has_sound') {
                    if(item?.value=="true"){
                      this.Speak("Authentification valide");
                      break;
                    }
                  }
                }
                let can_access = new Promise<void>((resolve) => {
                  /* --------------- Stokage des informations d'utilisateur --------------- */
                  this.generalService.set_data_to_session_crypted(r?.["auth_infos"]);
                  // Convertis en base64 puis en md5 ,utilisé pour les guards et les ngifs dans les composants coté front //
                  localStorage.setItem('id_role_crypted_front', btoa(r?.["id_role_crypted_front"]));
                  /* --------------- Stoquage de la configuration des modules --------------- */
                  r?.["can_access"].forEach((element: any, index: any, array: any) => {
                    if (element?.key
                      && element?.key != null
                      && element?.key != ""
                      && element?.value
                      && element?.value != null
                      && element?.value != "") {
                      if (Array.isArray(element?.value)) {
                        localStorage.setItem(
                          element?.key,
                          JSON.stringify(element?.value)
                        );
                      }
                    }
                    setTimeout(() => {
                      if (index === array.length - 1) resolve();
                    }, 1000);
                  });
                });
                can_access.then(() => {
                  setTimeout(() => {
                    this.router.navigate(["/accueil"]);
                  }, 500);
                });
              }
              else {
                this.error("Erreur de paramètres depuis l'api invalides !");
              }
              break;
            }
            case "mot_de_passe_invalide": {
              this.error("Mot de passe incorrect");
              break;
            }
            case "erreur_jwt": {
              this.error("Erreur de de géneration du ticket JWT !", false);
              break;
            }
            case "erreur": {
              this.error("Oups quelque chose a mal tourné au niveau de l'api !");
              break;
            }
            case "erreur_database": {
              this.error("Erreur lié à la base de données !");
              break;
            }
            case "non_autoriser": {
              this.error("Utilisateur non autorisé, veuillez contactez le support merci");
              break;
            }
            case "erreur_de_parametres": {
              this.error("Erreur de paramètres !");
              break;
            }
            default: {
              this.error("Oups quelque chose a mal tourné !");
              break;
            }
          } // fin switch
        },
        error: () => {
          this.is_loading = false;
        }
      });
    }
    else // Si le formulaire est invalide
    {
      this.error("Veuillez saisir les informations qui manquent !");
    }
  }

  error(message: any, if_speak: boolean = true) {
    this.messageService.add({ severity: 'error', detail: message });
    if (if_speak) { this.generalService.Speak(message); }
    this.is_loading = false;
  }

  Speak(message: any) {
    let synth = window.speechSynthesis;
    let utterance = new SpeechSynthesisUtterance();
    utterance.text = message;
    utterance.lang = "fr-FR";
    utterance.voice = synth.getVoices().filter(function (voice) { return voice.name == 'Google français'; })[0];
    synth.speak(utterance);
  }

  ngOnDestroy(): void {
    let unsubscribe: any[] = [
      this.Login
    ];
    unsubscribe.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}