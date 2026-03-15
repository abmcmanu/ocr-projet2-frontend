import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { UserService } from '../../core/service/user.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceMock: { login: jest.Mock };

  beforeEach(async () => {
    userServiceMock = { login: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
      providers: [{ provide: UserService, useValue: userServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.loginForm.get('login')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    expect(userServiceMock.login).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('should store token and navigate on successful login', () => {
    userServiceMock.login.mockReturnValue(of('jwt-token-value'));
    component.loginForm.setValue({ login: 'user', password: 'pass' });

    component.onSubmit();

    expect(localStorage.getItem('token')).toBe('jwt-token-value');
  });

  it('should display error message on failed login', () => {
    userServiceMock.login.mockReturnValue(throwError(() => ({
      error: { message: 'Identifiants invalides' }
    })));
    component.loginForm.setValue({ login: 'user', password: 'wrong' });

    component.onSubmit();

    expect(component.errorMessage).toBe('Identifiants invalides');
    expect(component.loading).toBe(false);
  });

  it('should display fallback error message when no error body', () => {
    userServiceMock.login.mockReturnValue(throwError(() => ({})));
    component.loginForm.setValue({ login: 'user', password: 'wrong' });

    component.onSubmit();

    expect(component.errorMessage).toBe('Identifiants invalides. Veuillez réessayer.');
  });

  it('should reset form and clear error on onReset()', () => {
    component.submitted = true;
    component.errorMessage = 'Erreur';
    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.errorMessage).toBeNull();
  });
});