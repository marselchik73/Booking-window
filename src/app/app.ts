import { Component } from '@angular/core';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormComponent],
  template: `<app-form></app-form>`
})
export class App {}