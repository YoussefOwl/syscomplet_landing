import { Component, OnInit, } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { GeneralService } from 'src/app/services/services';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {
  constructor(
    private appService: AppService, private config: PrimeNGConfig,
    public generalService: GeneralService) {
    this.generalService.if_load = false; // no loader
  }

  getClasses() {
    const classes = {
      'pinned-sidebar': this.appService.getSidebarStat().isSidebarPinned,
      'toggeled-sidebar': this.appService.getSidebarStat().isSidebarToggeled
    }
    return classes;
  }
  toggleSidebar() {
    this.appService.toggleSidebar();
  }

  ngOnInit(): void {
    /* -------------------------------------------------------------------------- */
    /*                                 Translation                                */
    /* -------------------------------------------------------------------------- */
    this.config.setTranslation({
      reject: 'Annuler',
      dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
      dayNamesMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
      monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
      monthNamesShort: ["<Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."],
      today: 'Aujourd\'hui',
      clear: 'Vider',
    });
  }
}
