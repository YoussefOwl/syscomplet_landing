import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: 'pipe_get_libelle',
  pure: true
})
export class pipe_get_libelle implements PipeTransform {
  transform(identifiant: any, liste: any[] = [], prop: any = 'label'): any {
    if (identifiant && liste.length > 0) {
      return liste.find((element: any) => Number(element?.value) == Number(identifiant))?.[prop];
    }
    else {
      return null;
    }
  }
}