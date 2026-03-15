import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { Student } from '../models/Student';
import { StudentRequest } from '../models/StudentRequest';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  const mockStudent: Student = {
    id: 1, firstName: 'Marie', lastName: 'Curie',
    email: 'marie@example.com', createdAt: '2024-01-01T00:00:00', updatedAt: '2024-01-01T00:00:00'
  };
  const mockRequest: StudentRequest = { firstName: 'Marie', lastName: 'Curie', email: 'marie@example.com' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() should send GET to /api/students', () => {
    service.getAll().subscribe(students => {
      expect(students).toEqual([mockStudent]);
    });
    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('GET');
    req.flush([mockStudent]);
  });

  it('getById() should send GET to /api/students/1', () => {
    service.getById(1).subscribe(s => {
      expect(s).toEqual(mockStudent);
    });
    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockStudent);
  });

  it('create() should send POST to /api/students', () => {
    service.create(mockRequest).subscribe(s => {
      expect(s).toEqual(mockStudent);
    });
    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockStudent);
  });

  it('update() should send PUT to /api/students/1', () => {
    service.update(1, mockRequest).subscribe(s => {
      expect(s).toEqual(mockStudent);
    });
    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockStudent);
  });

  it('delete() should send DELETE to /api/students/1', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});