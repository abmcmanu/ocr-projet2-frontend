import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { StudentDetailComponent } from './student-detail.component';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/Student';

const mockStudent: Student = {
  id: 1, firstName: 'Marie', lastName: 'Curie',
  email: 'marie@example.com', createdAt: '2024-01-01T00:00:00', updatedAt: '2024-01-01T00:00:00'
};

describe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;
  let studentServiceMock: { getById: jest.Mock };

  beforeEach(async () => {
    studentServiceMock = { getById: jest.fn().mockReturnValue(of(mockStudent)) };

    await TestBed.configureTestingModule({
      imports: [StudentDetailComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [
        { provide: StudentService, useValue: studentServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load student on init', () => {
    expect(studentServiceMock.getById).toHaveBeenCalledWith(1);
    expect(component.student).toEqual(mockStudent);
    expect(component.loading).toBe(false);
  });

  it('should display error message when student not found', () => {
    studentServiceMock.getById.mockReturnValue(throwError(() => ({
      error: { message: 'Étudiant introuvable' }
    })));

    component.ngOnInit();

    expect(component.errorMessage).toBe('Étudiant introuvable');
  });
});