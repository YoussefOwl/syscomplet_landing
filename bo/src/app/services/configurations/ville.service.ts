import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { ApiService } from "../api/api-service";
@Injectable({
    providedIn: "root"
})
export class VilleService {
    constructor(private apiService: ApiService) { }
    /* --------------------------- les apis des villes -------------------------- */
    AfficherVille(data: any) {
        return this.apiService.post(environment.API_BASE_URL_CONFIGURATIONS + environment.api.ville.afficher, data);
    }
    AjouterVille(data: any) {
        return this.apiService.post(environment.API_BASE_URL_CONFIGURATIONS + environment.api.ville.ajouter, data);
    }
    RestaurerVille(data: any) {
        return this.apiService.post(environment.API_BASE_URL_CONFIGURATIONS + environment.api.ville.RestaurerVille, data);
    }
    SupprimerVille(data: any) {
        return this.apiService.post(environment.API_BASE_URL_CONFIGURATIONS + environment.api.ville.supprimer, data);
    }
    ModifierVille(data: any) {
        return this.apiService.post(environment.API_BASE_URL_CONFIGURATIONS + environment.api.ville.modifier, data);
    }
}