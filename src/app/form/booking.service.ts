// src/app/form/booking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Интерфейс для данных формы
export interface BookingData {
  name: string;
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root' // сервис будет доступен во всём приложении
})
export class BookingService {
  // Адрес вашего бэкенда (пока тестовый)
private apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  constructor(private http: HttpClient) {}

  // Метод отправки данных на сервер
  createBooking(data: BookingData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}