import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/Auth/auth.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { routes } from 'src/app/shared/service/routes/routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public routes = routes;
  loginForm: FormGroup;
  errorMessage: string = '';
  loading = false;

  passwordType = 'password';
  showPassword = true;

  // Welcome Login Carousel Data
  welcomeLogin = [
    { img: 'assets/img/register-img.png' },
    { img: 'assets/img/register-img.png' },
    { img: 'assets/img/register-img.png' }
  ];

  public welcomeLoginOwlOptions: OwlOptions = {
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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  /**
   * 🔹 Handle Login Submission
   */
  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    console.log('📤 Sending login request:', this.loginForm.value);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('✅ Login Successful:', response);
        localStorage.setItem('token', response.token);

        // 🔹 Redirection en fonction du rôle
        switch (response.role) {
          case 'ADMIN':
            this.router.navigate(['/instructor/instructor-dashboard']);
            break;
          case 'MODERATOR':
            this.router.navigate(['/home-three']); // Change selon ta page modérateur
            break;
          default:
            this.router.navigate(['/home-four']); // Page par défaut des utilisateurs normaux
            break;
        }

        alert('✅ Login successful!');
      },
      error: (error) => {
        console.log('❌ Login Error:', error);
        this.errorMessage = error.error?.message || error.message || 'Invalid credentials. Please try again.';
        this.loading = false;
      },
    });
  }



  /**
   * 🔹 Toggle Password Visibility
   */
  togglePassword() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.showPassword = !this.showPassword;
  }
}
