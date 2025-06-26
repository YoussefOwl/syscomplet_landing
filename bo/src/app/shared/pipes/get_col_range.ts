import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
    name: 'get_col_range',
    pure: true,
    standalone: false
})
export class get_col_range implements PipeTransform {
  transform(reps: number): any[] {
    return Array.from({ length: reps }, (_, index) => index)
  }
}