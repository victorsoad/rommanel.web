// src/app/features/customer/services/customer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, PagedResult } from '../models/customer.models';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'https://localhost:7255/api/Customer';

  constructor(private http: HttpClient) {}

  getCustomers(pageNumber: number, pageSize: number): Observable<PagedResult<Customer>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<Customer>>(this.baseUrl, { params });
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, customer);
  }

  updateCustomer(id: string, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }  
}
