import { AbstractControl, ValidationErrors } from '@angular/forms';

export function allowedValuesValidatos(allowed: string[]) {
  return (control: AbstractControl): ValidationErrors | null => {
    return allowed.includes(control.value) ? null : { invalidValue: true };
  };
}
