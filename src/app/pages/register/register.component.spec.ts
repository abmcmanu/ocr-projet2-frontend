import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceMock: { register: jest.Mock };

  beforeEach(async () => {
    userServiceMock = { register: jest.fn().mockReturnValue(of({})) };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, RouterTestingModule],
      providers: [
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    expect(userServiceMock.register).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('should call register() with form values on submit', () => {
    component.registerForm.setValue({
      firstName: 'John', lastName: 'Doe', login: 'john', password: 'pass'
    });

    component.onSubmit();

    expect(userServiceMock.register).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: 'John', login: 'john' })
    );
  });

  it('should expose form controls via form getter', () => {
    expect(component.form['firstName']).toBeDefined();
    expect(component.form['login']).toBeDefined();
  });

  it('should reset submitted flag and form on onReset()', () => {
    component.submitted = true;
    component.registerForm.setValue({
      firstName: 'John', lastName: 'Doe', login: 'john', password: 'pass'
    });

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.registerForm.get('firstName')?.value).toBeNull();
  });
});