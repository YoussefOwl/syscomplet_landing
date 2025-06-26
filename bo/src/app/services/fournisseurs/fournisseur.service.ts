import { Injectable } from '@angular/core';
import { ApiService } from '../services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  constructor(private apiService: ApiService) { }

  AfficherFournisseur(data: any) {
    return this.apiService.post(environment.API_BASE_URL_FOURNISSEUR + environment.api.fournisseurs.AfficherFournisseur, data);
  }
  AjouterFournisseur(data: any) {
    return this.apiService.postUpload(environment.API_BASE_URL_FOURNISSEUR + environment.api.fournisseurs.AjouterFournisseur, data);
  }
  ModifierFournisseur(data: any) {
    return this.apiService.post(environment.API_BASE_URL_FOURNISSEUR + environment.api.fournisseurs.ModifierFournisseur, data);
  }
  SupprimerFournisseur(data: any) {
    return this.apiService.post(environment.API_BASE_URL_FOURNISSEUR + environment.api.fournisseurs.SupprimerFournisseur, data);
  }
  ManageImage(data: any) {
    return this.apiService.postUpload(environment.API_BASE_URL_FOURNISSEUR + environment.api.fournisseurs.ManageImage, data);
  }
}
