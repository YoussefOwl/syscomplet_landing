import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { ApiService } from "../api/api-service";
@Injectable({
    providedIn: "root"
})
export class NewslettersService {
    constructor(private apiService: ApiService) { }
    /* --------------------------- les apis des villes -------------------------- */
    AfficherNewslettersAdmins(data: any) {
        return this.apiService.post(environment.API_BASE_URL_NEWSLETTERS + environment.api.newsletters.AfficherNewslettersAdmins, data);
    }
    SupprimerNewsletter(data: any) {
        return this.apiService.post(environment.API_BASE_URL_NEWSLETTERS + environment.api.newsletters.SupprimerNewsletter, data);
    }
}