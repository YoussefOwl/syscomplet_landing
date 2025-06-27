import { Injectable } from '@angular/core';
import { ApiService } from '../services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemandeDemoService {

  constructor(private apiService: ApiService) { }
  afficherDemandesDemo(body?:any) {
    return this.apiService.post(environment.API_BASE_URL_CONTACT + environment.api.contacts.afficherDemandesDemo, body);
  } 
  marqueVuDemandesDemo(body?:any) {
    return this.apiService.post(environment.API_BASE_URL_CONTACT + environment.api.contacts.marqueVuDemandesDemo, body);
  }
}
