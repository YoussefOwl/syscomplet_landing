import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  public year: any;

  constructor() {
    this.year = (new Date()).getFullYear();
  }

  ngOnInit():void {
  }

}