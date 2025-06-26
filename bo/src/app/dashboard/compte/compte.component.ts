import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html'
})
export class CompteComponent implements OnInit {

  /* ----------------------- les variables globales ----------------------- */
  lasttab_selected_compte: any;
  id_user: any;
  image: any;
  items: any[] = [{ label: 'Gestion du compte', link: '/compte' }];

  constructor(
    public generalService: GeneralService,
    private router: Router) {
    /* ----------------------------- Initialisations ---------------------------- */
    this.id_user = this.generalService.get_data_from_session_decrypted('id_user');
    this.image = this.generalService.get_data_from_session_decrypted('image_user_path');
  }

  ngOnInit(): void {
    /* ------------------------ La fonction d'indéxation tes tabs ------------------------ */
    this.LastTabSelected();
  }

  onItemClick(event: any) {
    if (event?.item) {
      if (event?.item?.routerLink && event?.item?.routerLink == "/accueil") {
        this.generalService.is_loading = true;
        this.router.navigate([event?.item?.routerLink]).then(() => {
          setTimeout(() => {
            this.generalService.currentMenu = "/accueil";
            let element: any = document.getElementById("/accueil");
            if (element) {
              element.scrollIntoView({behavior: "smooth",block: "end",inline: "end" });
            }
            this.generalService.is_loading = false;
          }, 1000);
        });
      }
    }
  }

  /* --------------------- les fonctions d'idéxation des tabs -------------------- */
  LastTabSelected() {
    let check = Number(this.generalService.get_data_from_session_decrypted("lasttab_selected_compte"));
    this.lasttab_selected_compte = check ? check : 0;
  }

  indexer(e: any) {
    switch (e?.index) {
      case 0:
        {
          this.lasttab_selected_compte = 0;
          let body: any[] = [{ key: "lasttab_selected_compte", value: 0 }];
          this.generalService.set_data_to_session_crypted(body);
        }
        break;
      /* ------------------- Le composant de l'image du profile ------------------- */
      case 1:
        {
          this.lasttab_selected_compte = 1;
          this.image = this.generalService.get_data_from_session_decrypted('image_user_path'); // mise à jour de l'image
          let body: any[] = [{ key: "lasttab_selected_compte", value: 1 }];
          this.generalService.set_data_to_session_crypted(body);
        }
        break;
      case 2:
        {
          this.lasttab_selected_compte = 2;
          let body: any[] = [{ key: "lasttab_selected_compte", value: 2 }];
          this.generalService.set_data_to_session_crypted(body);
        }
        break;
    }
  }
}