import { Component } from '@angular/core';
import { GeneralService } from './services/services';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(public generalService: GeneralService) {
  }
}