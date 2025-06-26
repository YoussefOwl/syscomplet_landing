import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService, UserService } from 'src/app/services/services';
import { Subscription } from 'rxjs';
import { PusherService } from 'src/app/services/general/pusher.service';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  /* ------------------------------ les variables ----------------------------- */
  menu_sidebar: any[] = [];
  user_data: any;
  is_loading: boolean = true;
  is_loading_image: boolean = true;
  image_user: any; // image d'utilisateur
  Afficher_image: Subscription;
  Subscription_image: Subscription;
  Subscription_data: Subscription;
  search_fliter: string = '';
  if_has_sound: boolean = true;

  /* -------------------------------------------------------------------------- */
  /*                        EN CAS DU CLICK SUR PRECEDANT                       */
  /* -------------------------------------------------------------------------- */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    let url: any = window.location.href.replace(environment.FRONT_URL, '');
    let url_array: any[] = url.split("/");
    let mySubString: any = url_array[1];
    if (mySubString != "login") {
      this.Gotomenu({ routerLink: `/${mySubString}` }, true);
    }
  }

  constructor(
    private router: Router,
    private appService: AppService,
    private pusherService: PusherService,
    private UserService: UserService,
    public generalService: GeneralService) {

    /* ----------------------------- Gestion du son ----------------------------- */
    if (this.generalService.get_data_from_session_decrypted('if_has_sound') == "false") {
      this.if_has_sound = false;
    }
    /* -------------------------------------------------------------------------- */
    /*                               Initialisation                               */
    /* -------------------------------------------------------------------------- */

    /* ---- Récupération du menu du sidbar suivant le rôle d'utilisateur ---- */

    if (this.generalService.get_data_from_session_decrypted('sidebar')) {
      this.menu_sidebar = this.generalService.get_data_from_session_decrypted('sidebar');
      /* ------------------- Gestion de l'image d'utilisateur ------------------ */
      let image_user_path: any = this.generalService.get_data_from_session_decrypted('image_user_path');
      if (image_user_path) {
        this.GetImageUser(image_user_path);
      }
      else {
        this.image_user = null;
        this.is_loading = false;
        this.is_loading_image = false;
      }
    }
    else {
      /* ------------------------ Déstruction de la session ----------------------- */
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }

    /* -- Cette fonction permet de faire communiquer le composant sidebar et image_profile -- */

    this.Subscription_image = this.pusherService.GetterSideBar
      .subscribe(data => {
        if (data == true) {
          this.is_loading_image = true;
          this.is_loading = true;
          this.GetImageUser(this.generalService.get_data_from_session_decrypted('image_user_path'));
        }
        else if (data == false) {
          this.is_loading = true;
          this.is_loading_image = true;
          setTimeout(() => {
            this.is_loading = false;
            this.is_loading_image = false;
            this.image_user = null;
          }, 200);
        }
      });

    /* -- Cette fonction permet de faire communiquer le composant sidebar et infos_profile -- */

    this.Subscription_data = this.pusherService.GetterSideBar_data
      .subscribe((data: any) => {
        if (data) {
          /* ------------------------- Mise à jour du sidebar ------------------------- */
          this.user_data.nom = data?.nom;
          this.user_data.prenom = data?.prenom;
          /* ------------------------ Mise à jour de la session ----------------------- */
          let body: any = [
            {
              key: "nom",
              value: data?.nom
            },
            {
              key: "prenom",
              value: data?.prenom
            }
          ];
          this.generalService.set_data_to_session_crypted(body);
        }
      });
  }

  ngOnInit(): void {
    /* ---------------------- Récupération des informations ---------------------- */
    this.GetInfoUser();
    /* ---------------- Séléction du current menu sur le sidebar ---------------- */
    this.GetCurentUrl();
  }

  GetInfoUser() {
    this.user_data = {
      nom: this.generalService.get_data_from_session_decrypted("nom"),
      prenom: this.generalService.get_data_from_session_decrypted("prenom"),
      libelle_role: this.generalService.get_data_from_session_decrypted("libelle_role")
    };
  }

  /* ---------------------- Auto-select sidebar elements ---------------------- */
  GetCurentUrl() {
    let urlMenuMap: any = environment.urlMenuMap;
    const currentMenu = urlMenuMap[this.router.url];
    if (currentMenu) {
      this.generalService.currentMenu = currentMenu;
      setTimeout(() => {
        this.Scrooltomenu(this.generalService.currentMenu);
      }, 1000);
    }
  }

  destroySession() {
    Swal.fire({
      title: "Fermeture de session",
      html:
        `<b>Êtes-vous sûr de vouloir fermer votre session ? </b>`,
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

  GetImageUser(image: any) {
    this.is_loading = true;
    this.is_loading_image = true;
    let body: any = {
      image_user_path: image,
      id_user: this.generalService.get_data_from_session_decrypted('id_user')
    };
    /* ------------------- Chargement de l'image depuis l'api ------------------- */
    this.Afficher_image = this.UserService.AfficherMonImage(body)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('api_message') && res?.["api_message"] == "success") {
          this.image_user = res?.image_user;
          this.is_loading = false;
          this.is_loading_image = false;
        }
        else {
          this.generalService.errorSwal("Oups quelque chose a mal tourné");
          this.is_loading = false;
          this.is_loading_image = false;
        }
      }, () => { this.is_loading = false; this.is_loading_image = false; });
  }

  Gotomenu(menu: any, if_scrool: boolean = false) {
    this.generalService.is_loading = true;
    this.generalService.currentMenu = menu?.routerLink;
    this.router.navigate([menu?.routerLink])
      .then(() => {
        this.appService.toggleSidebar();
        setTimeout(() => {
          let element: any = document.getElementById("top_bar_html");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
          }
          setTimeout(() => {
            this.generalService.is_loading = false;
            if (if_scrool) {
              this.Scrooltomenu(menu?.routerLink);
            }
          }, 250);
        }, 250);
      });
  }

  Scrooltomenu(target: any) {
    let element: any = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                     Recherche dynamique sur le sidebar                     */
  /* -------------------------------------------------------------------------- */
  FilterSidebar() {
    if (this.search_fliter.length > 0) {
      let new_menu: any[] = this.generalService.get_data_from_session_decrypted('sidebar').filter(item =>
        ((item?.title.toLowerCase()).normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
          .indexOf((this.search_fliter.toLowerCase()).normalize("NFD").replace(/[\u0300-\u036f]/g, "")) > -1
      );
      this.menu_sidebar = new_menu;
    }
    else {
      this.menu_sidebar = this.generalService.get_data_from_session_decrypted('sidebar');
    }
  }

  GotoMenuSidebar(event: any) {
    if (event?.keyCode === 13) {
      if (this.menu_sidebar.length == 1) {
        this.Gotomenu({ 'routerLink': this.menu_sidebar?.[0]?.routerLink }, true);
      }
    }
  }

  ngOnDestroy(): void {
    let unsubscribe_liste: any[] = [
      this.Afficher_image,
      this.Subscription_image,
      this.Subscription_data
    ];
    unsubscribe_liste.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}