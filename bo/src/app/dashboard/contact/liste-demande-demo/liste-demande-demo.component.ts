import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DemandeDemoService } from 'src/app/services/contacts/demande-demo.service';
import { GeneralService } from 'src/app/services/services';

@Component({
  selector: 'app-liste-demande-demo',
  templateUrl: './liste-demande-demo.component.html',
})
export class ListeDemandeDemoComponent {
  is_loading: boolean = true;

  /* ------------------------------ Global Variables ----------------------------- */
  afficher: Subscription;
  vu: Subscription;

  /* ------------------------ Display Variables ----------------------- */
  skip: number = 0;
  take: number = 10;
  order: string = 'asc';
  colone: string = 'id';
  totalRecords: number = 0;
  liste_demande_demo: any[] = [];
  formulaireRecherche: FormGroup;

  headerProps: any[] = [
    { burgerMenu: true, style: 'width: 5rem !important' },
    { key: 'nom_demandeur', label: 'Nom', sort: true },
    { key: 'email_demandeur', label: 'Email', sort: true },
    { key: 'phone_demandeur', label: 'Phone', sort: true },
    { key: 'entreprise_demandeur', label: 'Entreprise', sort: true },
    { key: 'vu', label: 'État', sort: true },
    { key: 'id', label: 'Date de demande', sort: true },
    { label: 'Actions', style: 'width: 15rem !important' },
  ];

  constructor(
    private demandeDemoService: DemandeDemoService,
    protected generalService: GeneralService
  ) {
    this.formulaireRecherche = new FormGroup({
      date_debut: new FormControl(null),
      date_fin: new FormControl(null),
      nom_demandeur: new FormControl(null),
      email_demandeur: new FormControl(null),
      phone_demandeur: new FormControl(null),
      entreprise_demandeur: new FormControl(null),
      etat: new FormControl(false),
    });
  }

  ngOnInit() {
    this.afficherDemandesDemo();
  }

  rechercher() {
    this.skip = 0;
    this.take = 10;
    this.afficherDemandesDemo();
  }

  clearSearch() {
    this.formulaireRecherche.reset();
    setTimeout(() => {
      this.rechercher();
    }, 100);
  }

  afficherDemandesDemo() {
    this.is_loading = true;
    this.afficher = this.demandeDemoService
    .afficherDemandesDemo({
      skip: this.skip,
      take: this.take,
      order: this.order,
      colone: this.colone,
      ...this.formulaireRecherche.value,
    })
    .subscribe({
      next: (res: any) => {
        switch (res?.api_message) {
          case 'success':
            this.liste_demande_demo = res?.data || [];
            this.totalRecords = res?.totalRecords || 0;
            break;
          default:
            this.generalService.errorSwal(
              'Oups, quelque chose a mal tourné au niveau du serveur !'
            );
            break;
        }
        this.is_loading = false
      },
      error: () => (this.is_loading = false),
    });
  }

  paginate(event: any) {
    this.take = event?.rows;
    this.skip = event?.first;
    setTimeout(() => {
      this.afficherDemandesDemo();
    }, 10);
  }

  sort(event: any) {
    this.colone = event?.field;
    this.order = event?.order == -1 ? 'desc' : 'asc';
    setTimeout(() => {
      this.afficherDemandesDemo();
    }, 10);
  }

  /* ----------------------------- marqué comme vu ---------------------------- */
  onVu(dataItem:any) {
    this.generalService.sweetAlert2("Voulez voue marquer cette demannde comme vue?", "Cette action ne peut pas être annulée !", "confirm", "question")
    .then((result) => {
      if (result?.isConfirmed) this.marqueVuDemandesDemo(dataItem)
    });
  }

  marqueVuDemandesDemo(dataItem:any) {
    this.is_loading = true;
    this.vu = this.demandeDemoService.marqueVuDemandesDemo({_id : dataItem?._id})
    .subscribe({
      next: (res: any) => {
        switch (res?.api_message) {
          case 'success':
            this.generalService.sweetAlert2(res?.message, '', 'simple', 'success')
            .then(()=> this.afficherDemandesDemo());
            break;
          case 'erreur_de_parametres':
            this.generalService.errorSwal("Erreur de paramètres !");
            break;
          default:
            this.generalService.errorSwal('Oups, quelque chose a mal tourné au niveau du serveur !');
            break;
        }
        this.is_loading = false
      },
      error: () => (this.is_loading = false)
    });
  }

  ngOnDestroy(): void {
    this.afficher?.unsubscribe();
    this.vu?.unsubscribe();
  }
}
