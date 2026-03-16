// ──────────────────────────────────────────────
//  Tests E2E — Page de connexion (/login)
// ──────────────────────────────────────────────

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('affiche le formulaire de connexion', () => {
    cy.contains('h5', 'Login').should('be.visible');
    cy.get('input[formControlName="login"]').should('exist');
    cy.get('input[formControlName="password"]').should('exist');
    cy.contains('button', 'Se connecter').should('be.visible');
  });

  it('connexion réussie redirige vers /students', () => {
    // Mock API — POST /api/login retourne un token JWT
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: 'fake-jwt-token',
    }).as('loginRequest');

    // Mock API — GET /api/students requis par la page suivante
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] }).as('getStudents');

    cy.get('input[formControlName="login"]').type('admin');
    cy.get('input[formControlName="password"]').type('password');
    cy.contains('button', 'Se connecter').click();

    cy.wait('@loginRequest');
    cy.url().should('include', '/students');
  });

  it('le bouton Annuler réinitialise le formulaire', () => {
    cy.get('input[formControlName="login"]').type('test');
    cy.contains('button', 'Annuler').click();
    cy.get('input[formControlName="login"]').should('have.value', '');
  });
});