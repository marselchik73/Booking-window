import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingService, BookingData } from './booking.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-zА-Яа-яё\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^\+7\d{10}$/) // строгий формат: +7 и 10 цифр
      ]]
    });
  }

  // Форматирование телефона при вводе
  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Удаляем всё, кроме цифр
    let digits = value.replace(/\D/g, '');

    // Если есть цифры, формируем строку +7 и первые 10 цифр
    if (digits.length > 0) {
      // Если первая цифра 7 или 8, заменяем на +7
      if (digits.startsWith('7') || digits.startsWith('8')) {
        digits = digits.substring(1); // убираем первую цифру (7 или 8)
      }
      // Оставляем не более 10 цифр
      digits = digits.substring(0, 10);
      value = '+7' + digits;
    } else {
      // Если цифр нет, оставляем пустую строку (или можно оставить +7, но тогда валидация не пройдёт)
      value = '';
    }

    // Обновляем значение в форме, если оно изменилось
    if (input.value !== value) {
      input.value = value;
      this.form.get('phone')?.setValue(value, { emitEvent: false }); // обновляем контрол без вызова событий
    }
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return control ? control.invalid && control.touched : false;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData: BookingData = this.form.value;
      this.bookingService.createBooking(formData).subscribe({
        next: () => {
          alert('Заявка успешно отправлена!');
          this.form.reset();
        },
        error: (err) => {
          let msg = 'Ошибка. Попробуйте позже.';
          if (err.status === 0) msg = 'Сервер недоступен';
          else if (err.error?.error) msg = err.error.error;
          alert(msg);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}