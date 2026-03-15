import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { StudentListComponent } from './student-list.component';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/Student';

const mockStudents: Student[] = [
  { id: 1, firstName: 'Marie', lastName: 'Curie', email: 'marie@example.com', createdAt: '', updatedAt: '' },
  { id: 2, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', createdAt: '', updatedAt: '' }
];

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let studentServiceMock: { getAll: jest.Mock; delete: jest.Mock };
  let router: Router;

  beforeEach(async () => {
    studentServiceMock = {
      getAll: jest.fn().mockReturnValue(of(mockStudents)),
      delete: jest.fn().mockReturnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      imports: [StudentListComponent, RouterTestingModule],
      providers: [{ provide: StudentService, useValue: studentServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load students on init', () => {
    expect(studentServiceMock.getAll).toHaveBeenCalled();
    expect(component.students).toEqual(mockStudents);
    expect(component.loading).toBe(false);
  });

  it('should display error message when loading fails', () => {
    studentServiceMock.getAll.mockReturnValue(throwError(() => ({
      error: { message: 'Erreur serveur' }
    })));

    component.loadStudents();

    expect(component.errorMessage).toBe('Erreur serveur');
    expect(component.loading).toBe(false);
  });

  it('should reload list after successful delete', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    studentServiceMock.getAll.mockReturnValue(of([]));

    component.delete(1);

    expect(studentServiceMock.delete).toHaveBeenCalledWith(1);
    expect(studentServiceMock.getAll).toHaveBeenCalledTimes(2);
  });

  it('should not delete when confirm is cancelled', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    component.delete(1);

    expect(studentServiceMock.delete).not.toHaveBeenCalled();
  });

  it('should display error message when delete fails', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    studentServiceMock.delete.mockReturnValue(throwError(() => ({
      error: { message: 'Erreur suppression' }
    })));

    component.delete(1);

    expect(component.errorMessage).toBe('Erreur suppression');
  });

  it('goToDetail() should navigate to /students/:id', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.goToDetail(42);
    expect(navigateSpy).toHaveBeenCalledWith(['/students', 42]);
  });

  it('goToCreate() should navigate to /students/new', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.goToCreate();
    expect(navigateSpy).toHaveBeenCalledWith(['/students', 'new']);
  });

  it('logout() should clear token and navigate to /login', () => {
    localStorage.setItem('token', 'abc');
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});