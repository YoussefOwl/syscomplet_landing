import { NgModule } from '@angular/core';
/* ----------------------------- Primeng Modules ---------------------------- */
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PickListModule } from 'primeng/picklist';
import { MessagesModule } from 'primeng/messages';
import { AccordionModule } from 'primeng/accordion';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MultiSelectModule } from 'primeng/multiselect';
import { FieldsetModule } from 'primeng/fieldset';
import { MenubarModule } from 'primeng/menubar';
import { FileUploadModule } from 'primeng/fileupload';
import { StepsModule } from 'primeng/steps';
import { PaginatorModule } from 'primeng/paginator';
import { InputMaskModule } from 'primeng/inputmask';
import { ImageModule } from 'primeng/image';
import { CheckboxModule } from 'primeng/checkbox';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SkeletonModule } from 'primeng/skeleton';
@NgModule({
  imports: [
    CKEditorModule,
    ImageModule,
    PaginatorModule,
    StepsModule,
    MenubarModule,
    AccordionModule,
    MultiSelectModule,
    PickListModule,
    CalendarModule,
    TooltipModule,
    DialogModule,
    TabViewModule,
    CardModule,
    MessagesModule,
    DataViewModule,
    PanelModule,
    InputSwitchModule,
    DropdownModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    ButtonModule,
    FileUploadModule,
    TableModule,
    FieldsetModule,
    BreadcrumbModule,
    InputMaskModule,
    CheckboxModule,
    SkeletonModule
  ],
  exports: [
    CKEditorModule,
    ImageModule,
    PaginatorModule,
    StepsModule,
    MenubarModule,
    AccordionModule,
    MultiSelectModule,
    PickListModule,
    CalendarModule,
    TooltipModule,
    DialogModule,
    TabViewModule,
    CardModule,
    MessagesModule,
    DataViewModule,
    PanelModule,
    InputSwitchModule,
    DropdownModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    ButtonModule,
    FileUploadModule,
    TableModule,
    FieldsetModule,
    BreadcrumbModule,
    InputMaskModule,
    CheckboxModule,
    SkeletonModule
  ]
})
export class SharedPrimeModule { }