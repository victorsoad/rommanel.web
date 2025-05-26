import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Campo vazio, outra validação trata.
    }

    // Remove qualquer caractere não numérico
    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length !== 8) {
      return { invalidDateFormat: 'Data inválida. Informe uma data no formato dd/MM/yyyy' };
    }

    const day = parseInt(numericValue.substr(0, 2), 10);
    const month = parseInt(numericValue.substr(2, 2), 10);
    const year = parseInt(numericValue.substr(4, 4), 10);

    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
      return { invalidDateFormat: 'Data inválida. Informe uma data no formato dd/MM/yyyy' };
    }

    // Opcional: Validação se a data existe (ex.: não existe 31/02)
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() + 1 !== month || date.getFullYear() !== year) {
      return { invalidDateFormat: 'Data inválida. Informe uma data existente' };
    }

    return null; // Tudo certo
  };
}
