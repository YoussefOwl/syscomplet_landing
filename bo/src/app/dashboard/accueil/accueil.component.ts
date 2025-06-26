import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeneralService, ConfigurationsService } from 'src/app/services/services';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})

export class AccueilComponent implements OnInit {
  /* ----------------------- les variables globales ----------------------- */
  items: any[] = [{ label: 'Page d\'accueil', link: '/accueil' }];
  is_loading: boolean = true;
  Afficher: Subscription;
  Afficher_params: Subscription;
  /* ------------------------ les variables d'affichage ----------------------- */
  skip: any = 0;
  take: any = 10;
  order: any = "desc";
  colone: any = "created_at";
  totalRecords: any = 0;
  liste_logs: any[] = [];

  constructor(
    public generalService: GeneralService,
    private router: Router,
    private configurationsService: ConfigurationsService) {
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

  ngOnInit(): void {
    this.AfficherLogs();
  }

  AfficherLogs() {
    this.is_loading = true;
    let body: any = {
      colone: this.colone,
      order: this.order,
      skip: this.skip,
      take: this.take,
      table_name: [
        'contenus',
        'partenaires',
      ]
    };
    this.Afficher = this.configurationsService.AfficherLogs(body)
      .subscribe((r: any) => {
        if (r.hasOwnProperty('api_message') && (r?.api_message == "success")) {
          this.liste_logs = r.hasOwnProperty('Data') ? r?.["Data"] : [];
          this.totalRecords = r.hasOwnProperty('totalRecords') ? r?.["totalRecords"] : 0;
          this.is_loading = false;
        }
        else {
          this.generalService.errorSwal("Oups quelque chose a mal tourné");
          this.is_loading = false;
        }
      }, () => {
        this.is_loading = false;
      });
  }

  paginate(event: any) {
    this.take = event?.rows;
    this.skip = event?.first;
    setTimeout(() => {
      this.AfficherLogs();
    }, 100);
  }

  Sort(event: any) {
    this.colone = event?.field
    this.order = (event?.order == -1) ? "desc" : "asc";
    setTimeout(() => {
      this.AfficherLogs();
    }, 100);
  }

  /* -- Lors de la destruction du composant pour ne pas avoir les memories leaks --*/
  ngOnDestroy(): void {
    let unsubscribe_elements: any[] = [
      this.Afficher_params,
      this.Afficher
    ];
    unsubscribe_elements.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}