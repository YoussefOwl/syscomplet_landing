import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { ApiService } from "../api/api-service";
@Injectable({
    providedIn: "root"
})
export class ContenusService {
    constructor(private apiService: ApiService) { }
    /* --------------------------- les apis des contenus -------------------------- */
    AfficherContenusAdmins(data: any) {
        return this.apiService.post(environment.API_BASE_URL_CONFIGURATIONS + environment.api.contenus.AfficherContenusAdmins, data);
    }
    ModifierContenu(data: any) {
        return this.apiService.post(environment.API_BASE_URL_CONFIGURATIONS + environment.api.contenus.ModifierContenu, data);
    }
    AjouterContenus(data: any) {
        return this.apiService.post(environment.API_BASE_URL_CONFIGURATIONS + environment.api.contenus.AjouterContenus, data);
    }
    ManageImage(data: any) {
        return this.apiService.postUpload(environment.API_BASE_URL_CONFIGURATIONS + environment.api.contenus.ManageImage, data);
    }
    SupprimerImage(data: any) {
        return this.apiService.post(environment.API_BASE_URL_CONFIGURATIONS + environment.api.contenus.SupprimerImage, data);
    }
}