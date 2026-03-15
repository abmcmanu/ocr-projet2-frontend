import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { Login } from '../../core/models/Login';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const credentials: Login = {
      login: this.loginForm.get('login')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.userService.login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (token: string) => {
          this.loading = false;
          localStorage.setItem('token', token);
          this.router.navigate(['/students']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message ?? 'Identifiants invalides. Veuillez réessayer.';
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.errorMessage = null;
    this.loginForm.reset();
  }
}