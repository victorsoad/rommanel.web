import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfCnpjFormat',
  standalone: true
})
export class CpfCnpjFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 11) {
      // CPF: 000.000.000-00
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleaned.length === 14) {
      // CNPJ: 00.000.000/0000-00
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
      // Se não for 11 ou 14 dígitos, retorna como está
      return value;
    }
  }
}
