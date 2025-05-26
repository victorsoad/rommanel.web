import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ageValidator(minAge: number = 18): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // se vazio, não valida aqui

    const birthDate = new Date(value);
    if (isNaN(birthDate.getTime())) return { invalidDate: true };

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    // Ajusta se ainda não fez aniversário este ano
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= minAge ? null : { ageInvalid: { requiredAge: minAge, actualAge: age } };
  };
}
