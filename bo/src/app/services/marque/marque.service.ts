import { Injectable } from '@angular/core';
import { ApiService } from '../services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarqueService {

  constructor(private apiService: ApiService) { }
  /* --------------------------- les apis des clients -------------------------- */
  AfficherMarque(data: any) {
    return this.apiService.post(environment.API_BASE_URL_MARQUES + environment.api.marques.AfficherMarque, data);
  }
  AjouterMarque(data: any) {
    return this.apiService.postUpload(environment.API_BASE_URL_MARQUES + environment.api.marques.AjouterMarque, data);
  }
  ModifierMarque(data: any) {
    return this.apiService.post(environment.API_BASE_URL_MARQUES + environment.api.marques.ModifierMarque, data);
  }
  SupprimerMarque(data: any) {
    return this.apiService.post(environment.API_BASE_URL_MARQUES + environment.api.marques.SupprimerMarque, data);
  }
  ManageLogo(data: any) {
    return this.apiService.postUpload(environment.API_BASE_URL_MARQUES + environment.api.marques.ManageLogo, data);
  }
}
