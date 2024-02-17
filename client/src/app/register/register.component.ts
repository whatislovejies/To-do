import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';
import { ApiComponent } from '../api/api.component';
import {
  FormsModule,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { log } from 'console';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  public registrationData = new FormGroup({
    FirstName: new FormControl('',Validators.required),
    LastName: new FormControl('',Validators.required),
    Email: new FormControl('',[Validators.required, Validators.email]),
    PasswordHash: new FormControl('',Validators.required),
  });

  public registerUser(): void{
    if (this.registrationData.valid) {
          this.ApiComponent.postData(this.registrationData.value).subscribe(
      (response) => {
        console.log('Успешно отправлено:', response);
      },
      (error) => {
        console.error('Ошибка при отправке данных:', error);
        console.error( this.registrationData);
      }
    );
    }else{
      alert('no valid')
    }




  }
  constructor(
    private themeService: ThemeService,
    private ApiComponent: ApiComponent
  ) {}

  get isDarkTheme(): boolean {
    return this.themeService.getIsDarkTheme();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
