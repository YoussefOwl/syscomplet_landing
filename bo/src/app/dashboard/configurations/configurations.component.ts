import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/services';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
})

export class ConfigurationsComponent implements OnInit {

  /* ------------------------- Les variables ------------------------- */
  lasttab_selected_configurations: any;
  items: any[] = [{ label: null, link: null }];

  constructor(public generalService: GeneralService, private router: Router) { }

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
              element.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
            }
            this.generalService.is_loading = false;
          }, 1000);
        });
      }
    }
  }

  /* --------------------- les fonctions d'idéxation des tabs -------------------- */
  LastTabSelected() {
    let check = Number(localStorage.getItem("lasttab_selected_configurations"));
    this.lasttab_selected_configurations = check ? check : 0;
    switch (check) {
      case 0:
        this.items = [{ label: "Gestion des comptes utilisateurs de l'application", link: null }];
        break;
      case 1:
        this.items = [{ label: "Gestion des rôles des comptes de l'application", link: null }];
        break;
      case 2:
        this.items = [{ label: "Gestion des logs d'activité", link: null }];
        break;
      case 3:
        this.items = [{ label: "Gestion des villes", link: null }];
        break;
    }
  }

  indexer(e: any) {
    switch (e?.index) {
      case 0:
        {
          this.lasttab_selected_configurations = 0;
          this.items = [{ label: "Gestion des comptes utilisateurs de l'application", link: null }];
          localStorage.setItem('lasttab_selected_configurations', '0');
        }
        break;
      case 1:
        {
          this.lasttab_selected_configurations = 1;
          this.items = [{ label: "Gestion des rôles des comptes de l'application", link: null }];
          localStorage.setItem('lasttab_selected_configurations', '1');
        }
        break;
      case 2:
        {
          this.lasttab_selected_configurations = 2;
          this.items = [{ label: "Gestion des logs d'activité", link: null }];
          localStorage.setItem('lasttab_selected_configurations', '2');
        }
        break;
      case 3:
        {
          this.lasttab_selected_configurations = 3;
          this.items = [{ label: "Gestion des villes", link: null }];
          localStorage.setItem('lasttab_selected_configurations', '3');
        }
        break;
    }
  }

}