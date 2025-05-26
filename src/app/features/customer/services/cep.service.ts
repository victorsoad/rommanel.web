import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean; // para checar se tem erro
}

@Injectable({
  providedIn: 'root'
})
export class CepService {

  private baseUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) { }

  consultarCep(cep: string): Observable<CepResponse> {
    const cleanCep = cep.replace(/\D/g, '');
    return this.http.get<CepResponse>(`${this.baseUrl}/${cleanCep}/json/`);
  }
}
