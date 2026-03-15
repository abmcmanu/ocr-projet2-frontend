import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { Login } from '../models/Login';
import { Register } from '../models/Register';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('register() should send POST to /api/register', () => {
    const payload: Register = { firstName: 'John', lastName: 'Doe', login: 'john', password: 'pass' };

    service.register(payload).subscribe();

    const req = httpMock.expectOne('/api/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('login() should send POST to /api/login and return token', () => {
    const credentials: Login = { login: 'john', password: 'pass' };

    service.login(credentials).subscribe(token => {
      expect(token).toBe('jwt-token');
    });

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush('jwt-token');
  });
});