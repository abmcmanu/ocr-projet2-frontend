import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/Student';

const mockStudent: Student = {
  id: 1, firstName: 'Marie', lastName: 'Curie',
  email: 'marie@example.com', createdAt: '', updatedAt: ''
};

describe('StudentFormComponent — create mode', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let studentServiceMock: { create: jest.Mock; getById: jest.Mock; update: jest.Mock };

  beforeEach(async () => {
    studentServiceMock = {
      create: jest.fn().mockReturnValue(of(mockStudent)),
      getById: jest.fn(),
      update: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [StudentFormComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [
        { provide: StudentService, useValue: studentServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be in create mode when no id param', () => {
    expect(component.isEditMode).toBe(false);
    expect(component.editId).toBeNull();
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    expect(studentServiceMock.create).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('should call create() with form values on submit', () => {
    component.studentForm.setValue({ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' });

    component.onSubmit();

    expect(studentServiceMock.create).toHaveBeenCalledWith({
      firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com'
    });
  });

  it('should display error on create failure', () => {
    studentServiceMock.create.mockReturnValue(throwError(() => ({
      error: { message: 'Email déjà utilisé' }
    })));
    component.studentForm.setValue({ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' });

    component.onSubmit();

    expect(component.errorMessage).toBe('Email déjà utilisé');
  });
});

describe('StudentFormComponent — edit mode', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let studentServiceMock: { create: jest.Mock; getById: jest.Mock; update: jest.Mock };

  beforeEach(async () => {
    studentServiceMock = {
      create: jest.fn(),
      getById: jest.fn().mockReturnValue(of(mockStudent)),
      update: jest.fn().mockReturnValue(of(mockStudent))
    };

    await TestBed.configureTestingModule({
      imports: [StudentFormComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [
        { provide: StudentService, useValue: studentServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be in edit mode when id param is present', () => {
    expect(component.isEditMode).toBe(true);
    expect(component.editId).toBe(1);
  });

  it('should pre-fill form with loaded student data', () => {
    expect(component.studentForm.get('firstName')?.value).toBe('Marie');
    expect(component.studentForm.get('email')?.value).toBe('marie@example.com');
  });

  it('should call update() on submit in edit mode', () => {
    component.studentForm.setValue({ firstName: 'Marie', lastName: 'Curie', email: 'marie@example.com' });

    component.onSubmit();

    expect(studentServiceMock.update).toHaveBeenCalledWith(1, {
      firstName: 'Marie', lastName: 'Curie', email: 'marie@example.com'
    });
  });
});