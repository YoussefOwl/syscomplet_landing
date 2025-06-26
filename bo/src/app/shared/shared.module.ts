import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPipesModule } from './shared_pipes.module';
import { SharedPrimeModule } from './shared_prime.module';
/* -------------------------------------------------------------------------- */
/*                          Les composants partagés                           */
/* -------------------------------------------------------------------------- */
import { loaderComponent } from './loader/loader.component';
import { ImageProfileComponent } from './image_profile/image_profile.component';
import { InformationComponent } from './informations/informations.component';
import { PasswordComponent } from './mot_de_passe/password.component';
@NgModule({
  declarations: [
    loaderComponent,
    PasswordComponent,
    InformationComponent,
    ImageProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedPrimeModule,
    SharedPipesModule
  ],
  exports: [
    /* ----------------------------- Les composants ----------------------------- */
    InformationComponent,
    ImageProfileComponent,
    PasswordComponent,
    loaderComponent,
    /* ------------------------------ Les modules ----------------------------- */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedPrimeModule,
    SharedPipesModule
  ]
})
export class SharedModule { }