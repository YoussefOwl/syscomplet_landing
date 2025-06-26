import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FournisseurService } from 'src/app/services/fournisseurs/fournisseur.service';
import { GeneralService } from 'src/app/services/services';

@Component({
  selector: 'app-liste-fournisseur',
  templateUrl: './liste-fournisseur.component.html'
})
export class ListeFournisseurComponent {
  is_loading: boolean = true;
  /* ------------------------------ Les variables globales ----------------------------- */
  Afficher_fournisseur: Subscription;
  Supprimer: Subscription;
  /* ------------------------ les variables d'affichage ----------------------- */
  skip: any = 0;
  take: any = 10;
  order: any = "asc";
  colone: any = "libelle_fournisseur";
  totalRecords: any = 0;
  liste_fournisseurs:any[] = [];
  FormulaireRecherche: FormGroup;
  headerProps: any[] = [
    { burgerMenu: true, style: "width: 5rem !important" },
    { label: 'Image'},
    { key: 'libelle_fournisseur', label: 'Fournisseur', sort: true },
    { key: 'description', label: 'observation', sort: true },
    { label: 'Actions', style: "width: 15rem !important" }
  ];
  /* ----------------- Les variables du popup ajout ou update ----------------- */
  Header_info: any;
  if_show_ajouter: boolean = false;
  if_show_update: boolean = false;
  if_show_image: boolean = false;
  dataItem: any;

  constructor(
    private fournisseurService:FournisseurService, 
    protected generalService:GeneralService
  ) {
    this.FormulaireRecherche = new FormGroup({
      libelle_fournisseur: new FormControl(null),
      description: new FormControl(null)
    });
  }

  ngOnInit() {
    this.AfficherFournisseur(); 
  }

  Rechercher() {
    this.skip = 0;
    this.take = 10;
    this.AfficherFournisseur();
  }

  ClearSearch() {
    this.FormulaireRecherche.reset();
    setTimeout(() => {
      this.Rechercher();
    }, 100);
  }

  AfficherFournisseur() {
    this.is_loading = true;
    this.Afficher_fournisseur = this.fournisseurService.AfficherFournisseur({
      skip: this.skip,
      take: this.take,
      order: this.order,
      colone: this.colone,
      ...this.FormulaireRecherche.value
    })
    .subscribe({
      next:(res:any)=>{
        switch (res?.api_message) {
          case "success":
            this.liste_fournisseurs = res?.data || [];
            this.totalRecords = res?.totalRecords || 0;
            break;
          default:
            this.generalService.errorSwal("Oups quelque chose a mal tourné au niveau du serveur !");
            break;
        }
      },
      complete: ()=> this.is_loading = false
    })
  }

  paginate(event: any) {
    this.take = event?.rows;
    this.skip = event?.first;
    setTimeout(() => {
      this.AfficherFournisseur();
    }, 10);
  }

  Sort(event: any) {
    this.colone = event?.field;
    this.order = (event?.order == -1) ? "desc" : "asc";
    setTimeout(() => {
      this.AfficherFournisseur();
    }, 10);
  }

  /* ---------------------------------- ajout --------------------------------- */
  ShowFormulaireAjout() {
    Promise.resolve()
    .then(() => {
      this.Header_info = "Formulaire d'ajout";
      this.dataItem = null;
    })
    .then(() => this.if_show_ajouter = true);
  }

  /* --------------------------------- update --------------------------------- */
  ShowFormulaireUpdate(dataItem: any) {
    Promise.resolve()
    .then(() => {
      this.Header_info = "Formulaire de modification";
      this.Header_info = "Modification des informations du fournisseur : " + dataItem?.libelle_fournisseur;
      this.dataItem = dataItem;
    })
    .then(() => this.if_show_update = true);
  }

  /* --------------------------------- delete --------------------------------- */
  onDelete(dataItem: any) {
    this.generalService.sweetAlert2("Voulez-vous supprimer cette ligne ?", null, "confirm", "question")
    .then((res: any) => {
      if (res?.isConfirmed) {
        this.SupprimerFournisseur(dataItem?._id);
      }
    })
  }

  SupprimerFournisseur(id:any) {
    this.is_loading = true;
    this.Supprimer = this.fournisseurService.SupprimerFournisseur({ _id: id })
    .subscribe({
      next: (res: any) => {
        switch (res?.api_message) {
          case "success":
            this.generalService.sweetAlert2('Fouisseur supprimé avec succès', null, 'simple', 'success')
            .then(() => this.AfficherFournisseur());
            break;
          case 'error_delete': 
            this.generalService.sweetAlert2(res?.title, null, 'simple', 'error', 'noTime')
            .then(() => this.AfficherFournisseur());
            break;
          default:
            this.generalService.errorSwal("Oups quelque chose a mal tourné !");
            break;
        }
      },
      complete: () => {
        this.is_loading = false;
      }
    });
  }

  /* --------------------------------- upload --------------------------------- */
  ShowImage(dataItem:any) {
    Promise.resolve()
    .then(()=> {
      this.dataItem = dataItem;
      this.Header_info = `image de : ${dataItem?.libelle_fournisseur}`;
    })
    .then(()=> {
      this.if_show_image = true;
    })
  }

  /* ---------------------------------- close --------------------------------- */
  CloseFormulaire() {
    Promise.resolve()
    .then(() => {
      this.if_show_update = false;
      this.if_show_ajouter = false;
      this.if_show_image = false;
      this.dataItem = null;
    })
    .then(() => this.AfficherFournisseur());
  }

  ngOnDestroy() {
    this.Afficher_fournisseur?.unsubscribe();
    this.Supprimer?.unsubscribe();
  }
}
