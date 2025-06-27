import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { DemandeDemoComponent } from './demande-demo.component';
import { RouterModule, Routes } from '@angular/router';
import { ListeDemandeDemoComponent } from './liste-demande-demo/liste-demande-demo.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes:Routes = [
  { 
    path: '', component: DemandeDemoComponent, 
    children: [
      {
        path: '',
        redirectTo: 'liste-demande-demo',
        pathMatch: 'full'
      },
      {
        path: 'liste-demande-demo',
        component: ListeDemandeDemoComponent
      }
    ]
  },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  declarations: [DemandeDemoComponent, ListeDemandeDemoComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class DemandeDemoModule {}
