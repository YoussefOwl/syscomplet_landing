import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { GeneralService } from 'src/app/services/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  /* ------------------------------ Les variables ----------------------------- */
  afficher_exipred: Subscription;

  constructor(
    private appService: AppService,
    public generalService: GeneralService,
    private router: Router) { }

  ngOnInit(): void {
  }

  destroySession() {
    Swal.fire({
      title: "Fermeture de session",
      html: `<b>Êtes-vous sûr de vouloir fermer votre session ? </b>`,
      icon: "info",
      showCancelButton: true,
      reverseButtons: true,
      cancelButtonText: "Annuler",
      confirmButtonColor: "#258662",
      cancelButtonColor: "#f50707",
      confirmButtonText: "Valider"
    }).then((result: any) => {
      if (result?.value) {
        /* ------------------------ Déstruction de la session ----------------------- */
        localStorage.clear();
        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 100);
      } // fin if result swal
    }); // fin then swal
  }

  toggleSidebarPin() {
    this.appService.toggleSidebarPin();
    this.generalService.menu_toggel = !this.generalService.menu_toggel
  }

  GotoPage(page: any) {
    this.generalService.is_loading = true;
    this.router.navigate([page]).then(() => {
      this.generalService.currentMenu = page;
      this.generalService.is_loading = false;
      setTimeout(() => {
        let element: any = document.getElementById(page);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
        }
      }, 1500);
    })
  }

  toggleSidebar() {
    this.appService.toggleSidebar();
  }

  ngOnDestroy(): void {
    this.afficher_exipred?.unsubscribe();
  }

}