import { NgModule } from '@angular/core';
import { pipe_get_libelle } from './pipes/pipe_get_libelle';
import { pipe_json } from './pipes/pipe_json';
import { get_col_range } from './pipes/get_col_range';
@NgModule({
  declarations: [
    pipe_json,
    pipe_get_libelle,
    get_col_range
  ],
  exports: [
    pipe_json,
    pipe_get_libelle,
    get_col_range
  ]
})
export class SharedPipesModule { }