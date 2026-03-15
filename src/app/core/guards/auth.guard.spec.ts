import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: { navigate: jest.Mock };

  beforeEach(() => {
    router = { navigate: jest.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: router }]
    });
  });

  afterEach(() => localStorage.clear());

  it('should allow access when token exists in localStorage', () => {
    localStorage.setItem('token', 'fake-jwt-token');

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to /login and return false when no token', () => {
    localStorage.removeItem('token');

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});