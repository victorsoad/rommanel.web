import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefoneFormat',
  standalone: true
})
export class TelefoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return value;
    }
  }
}
