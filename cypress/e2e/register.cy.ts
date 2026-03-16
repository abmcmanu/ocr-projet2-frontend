// ──────────────────────────────────────────────
//  Tests E2E — Page d'inscription (/register)
// ──────────────────────────────────────────────

describe('Register', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('affiche le formulaire d\'inscription', () => {
    cy.contains('h5', 'Registration Form').should('be.visible');
    cy.get('input[formControlName="firstName"]').should('exist');
    cy.get('input[formControlName="lastName"]').should('exist');
    cy.get('input[formControlName="login"]').should('exist');
    cy.get('input[formControlName="password"]').should('exist');
    cy.contains('button', 'Register').should('be.visible');
  });

  it('inscription réussie redirige vers /login', () => {
    // Mock API — POST /api/register
    cy.intercept('POST', '/api/register', {
      statusCode: 201,
      body: {},
    }).as('registerRequest');

    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="login"]').type('johndoe');
    cy.get('input[formControlName="password"]').type('password123');
    cy.contains('button', 'Register').click();

    cy.wait('@registerRequest');
    cy.url().should('include', '/login');
  });

  it('le bouton Cancel réinitialise le formulaire', () => {
    cy.get('input[formControlName="firstName"]').type('John');
    cy.contains('button', 'Cancel').click();
    cy.get('input[formControlName="firstName"]').should('have.value', '');
  });
});