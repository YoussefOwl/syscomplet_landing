import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ApiService } from "../api/api-service";
@Injectable({
  providedIn: "root",
})
export class PartenairesService {
  constructor(private apiService: ApiService) { }
  /* --------------------------- les apis des partenaires -------------------------- */
  AfficherPartenaire(data: any) {
    return this.apiService.post(environment.API_BASE_URL_PARTENAIRES + environment.api.partenaire.afficher, data);
  }
  AjouterPartenaire(data: any) {
    return this.apiService.post(environment.API_BASE_URL_PARTENAIRES + environment.api.partenaire.ajouter, data);
  }
  SupprimerPartenaire(data: any) {
    return this.apiService.post(environment.API_BASE_URL_PARTENAIRES + environment.api.partenaire.supprimer, data);
  }
  ModifierPartenaire(data: any) {
    return this.apiService.post(environment.API_BASE_URL_PARTENAIRES + environment.api.partenaire.modifier, data);
  }
  ModifierImagePartenaire(data: any) {
    return this.apiService.postUpload(environment.API_BASE_URL_PARTENAIRES + environment.api.partenaire.ModifierImagepartenaire, data);
  }
  SupprimerImagePartenaire(data: any) {
    return this.apiService.post(environment.API_BASE_URL_PARTENAIRES + environment.api.partenaire.SupprimerImagepartenaire, data);
  }
  RestaurerPartenaire(data: any) {
    return this.apiService.post(environment.API_BASE_URL_PARTENAIRES + environment.api.partenaire.restaurer, data);
  }
}
