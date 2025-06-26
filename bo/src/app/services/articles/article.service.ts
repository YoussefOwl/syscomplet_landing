import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services';
@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    constructor(private apiService: ApiService) { }
    AfficherArticle(data: any) {
        return this.apiService.post(environment.API_BASE_URL_ARTICLES + environment.api.articles.AfficherArticle, data);
    }
    AjouterArticle(data: any) {
        return this.apiService.postUpload(environment.API_BASE_URL_ARTICLES + environment.api.articles.AjouterArticle, data);
    }
    ModifierArticle(data: any) {
        return this.apiService.post(environment.API_BASE_URL_ARTICLES + environment.api.articles.ModifierArticle, data);
    }
    SupprimerArticle(data: any) {
        return this.apiService.post(environment.API_BASE_URL_ARTICLES + environment.api.articles.SupprimerArticle, data);
    }
    ManageImage(data: any) {
        return this.apiService.postUpload(environment.API_BASE_URL_ARTICLES + environment.api.articles.ManageImage, data);
    }
}
