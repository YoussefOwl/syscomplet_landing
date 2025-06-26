import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { ApiService } from "../api/api-service";
@Injectable({
    providedIn: "root"
})
export class ContactsService {
    constructor(private apiService: ApiService) { }
    /* --------------------------- les apis des villes -------------------------- */
    AfficherContactsAdmins(data: any) {
        return this.apiService.post(environment.API_BASE_URL_CONFIGURATIONS + environment.api.contacts.AfficherContactsAdmins, data);
    }
    ModifierContacts(data: any) {
        return this.apiService.post(environment.API_BASE_URL_CONFIGURATIONS + environment.api.contacts.ModifierContacts, data);
    }
}