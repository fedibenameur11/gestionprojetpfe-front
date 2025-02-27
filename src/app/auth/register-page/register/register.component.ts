import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/Auth/auth.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { passwordResponce, register } from 'src/app/models/register.model';
import { routes } from 'src/app/shared/service/routes/routes';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public routes = routes;
  registerForm: FormGroup;
  errorMessage: string = '';
  loading = false;

  passwordType = 'password';
  showPassword = true;
  passwordResponce: passwordResponce = {};
  typingStarted = false;
 // **🔹 Fix the register array initialization**
 register = [
  { img: 'assets/img/register-img.png' },
  { img: 'assets/img/register-img.png' },
  { img: 'assets/img/slide3.jpg' }
];
  // Carousel options
  public registerOwlOptions: OwlOptions = {
    margin: 25,
    nav: true,
    loop: true,
    responsive: {
      0: { items: 1 },
      768: { items: 3 },
      1170: { items: 4 }
    },
  };

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/),
        ],
      ],
      city: ['', Validators.required],
      numTel: ['', [Validators.required, Validators.pattern('^[0-9]{9,10}$')]],
      cin: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      role: ['USER'],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    console.log('📤 Données envoyées:', this.registerForm.value);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        alert('✅ Inscription réussie !');
        this.router.navigate([this.routes.login]);

      },
      error: (error) => {
        console.log('❌ Erreur API:', error);
        this.errorMessage = error.error.message || 'Une erreur est survenue';
        this.loading = false;
      },
    });
  }

  togglePassword() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.showPassword = !this.showPassword;
  }

  onChangePassword(password: string) {
    this.typingStarted = true;
    if (password.length < 8) {
      this.passwordResponce.passwordResponceText = "Weak. Must contain at least 8 characters";
      this.passwordResponce.passwordResponceKey = '0';
    } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      this.passwordResponce.passwordResponceText = "Average. Must contain an uppercase letter and a number";
      this.passwordResponce.passwordResponceKey = '1';
    } else if (!/[#?!@$%^&*-]/.test(password)) {
      this.passwordResponce.passwordResponceText = "Almost. Must contain a special symbol";
      this.passwordResponce.passwordResponceKey = '2';
    } else {
      this.passwordResponce.passwordResponceText = "Awesome! Secure password.";
      this.passwordResponce.passwordResponceKey = '3';
    }
  }
}
