import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from "@angular/forms";
import { GeneralService, ContenusService, ApiGeneralService } from 'src/app/services/services';

@Component({
  selector: 'app-contenu-liste',
  templateUrl: './contenu_liste.component.html'
})
export class ContenuListeComponent implements OnInit {
  /* ------------------------------ Les variables globales ----------------------------- */
  is_loading: boolean = true;
  afficher: Subscription;
  Afficher_excel: Subscription;
  Afficher_params: Subscription;
  /* ------------------------ les variables d'affichage ----------------------- */
  skip: any = 0;
  take: any = 10;
  order: any = "asc";
  colone: any = "html_id";
  totalRecords: any = 0;
  liste_contenus: any[] = [];
  FormmulaireRecherche: FormGroup;
  /* ----------------- Les variables du popup ----------------- */
  Header_info: any;
  if_show_crud: boolean = false;
  if_show_image: boolean = false;
  data_contenu: any;
  /* ---------------------------------- liste --------------------------------- */
  liste_page_positions: any[] = [];
  liste_pages: any[] = [];

  constructor(
    public generalService: GeneralService,
    private apiGeneralService:ApiGeneralService,
    private contenus_service: ContenusService) {
    /* ---------------------- Initialisation du formulaire ---------------------- */
    this.FormmulaireRecherche = new FormGroup({
      description_fr: new FormControl(null),
      description_ar: new FormControl(null),
      html_id: new FormControl(null),
      page: new FormControl(null),
      page_position: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.AfficherContenusAdmins();
    this.LoadParamsForList();
  }

  LoadParamsForList() {
    this.Afficher_params = this.apiGeneralService.LoadParamsForList({ pages : true, page_positions: true })
    .subscribe({
      next: (res:any)=> {
        if(res?.api_message === "success") {
          this.liste_page_positions = res?.liste_page_positions || [];
          this.liste_pages = res?.liste_pages || [];
        }
      },
      complete:()=> {
        this.is_loading = false;
      }
    })
  }

  /* -------------------------------------------------------------------------- */
  /*                       Les fonctions pour l'affichage                       */
  /* -------------------------------------------------------------------------- */
  ClearSearch() {
    this.FormmulaireRecherche.reset();
    this.RechercherContenu();
  }

  RechercherContenu() {
    this.skip = 0;
    this.take = 10;
    setTimeout(() => {
      this.AfficherContenusAdmins();
    }, 100);
  }

  AfficherContenusAdmins() {
    this.is_loading = true;
    let body: any = {
      colone: this.colone,
      order: this.order,
      skip: this.skip,
      take: this.take,
      ...this.FormmulaireRecherche.value
    };
    this.afficher = this.contenus_service.AfficherContenusAdmins(body)
      .subscribe((r: any) => {
        if (r?.["api_message"] == "success") {
          this.liste_contenus = r.hasOwnProperty('Data') ? r?.["Data"] : [];
          this.totalRecords = r.hasOwnProperty('totalRecords') ? r?.["totalRecords"] : 0;
          setTimeout(() => {
            this.is_loading = false;
          }, 500);
        }
        else {
          this.generalService.errorSwal("Oups quelque chose a mal tourné ...");
          this.is_loading = false;
        }
      }, () => { this.is_loading = false; });
  }

  paginate(event: any) {
    this.take = event?.rows;
    this.skip = event?.first;
    setTimeout(() => {
      this.AfficherContenusAdmins();
    }, 100);
  }

  Sort(event: any) {
    this.colone = event?.field;
    this.order = (event?.order == -1) ? "desc" : "asc";
    setTimeout(() => {
      this.AfficherContenusAdmins();
    }, 100);
  }

  export(type: any) {
    this.is_loading = true;
    this.Afficher_excel = this.contenus_service.AfficherContenusAdmins({
      if_excel: true,
      colone: this.colone,
      order: this.order,
      ...this.FormmulaireRecherche.value
    }).subscribe((res: any) => {
      if (res?.["api_message"] == "success") {
        if (res?.["Data"].length > 0) {
          let data: any[] = res?.["Data"].map((element: any) => (
            {
              'html_id': element?.html_id,
              'Description (FR)': element?.description_fr ? element?.description_fr : '',
              'Description (AR)': element?.description_ar ? element?.description_ar : '',
              "Date d'ajout sur le système": element?.created_at_formated ? element?.created_at_formated : '',
              "Date de la dernière modification": element?.updated_at_formated ? element?.updated_at_formated : ''
            }
          ));
          switch (type) {
            case "excel":
              this.generalService.exportAsExcelFile(data, 'Liste_contenus');
              break;
            case "csv":
              this.generalService.exportAsCsvFile(data, 'Liste_contenus');
              break;
            default:
              this.generalService.exportAsExcelFile(data, 'Liste_contenus');
              break;
          }
          this.is_loading = false;
        }
        else {
          this.generalService.errorSwal('Aucun contenu');
          this.is_loading = false;
        }
      }
      else {
        this.generalService.errorSwal("Oups quelque chose a mal tourné ...");
        this.is_loading = false;
      }
    }, () => { this.is_loading = false; });
  }

  /* ----------------------- Formulaire de modification ----------------------- */
  ShowFormulaire(dataItem: any=null) {
    if(dataItem) {
      this.data_contenu = dataItem;
      this.Header_info = `Modification du contenu : ${dataItem?.html_id}`;
      setTimeout(() => { this.if_show_crud = true; }, 100);
    }
    else {
      this.data_contenu = null;
      this.Header_info = `Ajout d'un nouveau contenu :`;
      setTimeout(() => { this.if_show_crud = true; }, 100);
    }
  }

  ShowImage(dataItem:any) {
    Promise.resolve()
    .then(()=> {
      this.data_contenu = dataItem;
      this.Header_info = `image de : ${dataItem?.html_id}`;
    })
    .then(()=> {
      this.if_show_image = true;
    })
  }

  /* ---------------- Férmeture du popup ---------------- */
  Close() {
    this.data_contenu = null;
    this.if_show_crud = false;
    this.if_show_image= false;
    this.AfficherContenusAdmins();
  }

  /* -- Lors de la destruction du composant pour ne pas avoir les memories leaks --*/
  ngOnDestroy(): void {
    let unsubscribe_elements: any[] = [
      this.afficher,
      this.Afficher_excel
    ];
    unsubscribe_elements.forEach((element: any) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}