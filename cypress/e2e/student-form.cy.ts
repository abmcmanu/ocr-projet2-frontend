/// <reference types="cypress" />
/// <reference path="../support/commands.ts" />
// ──────────────────────────────────────────────
//  Tests E2E — Formulaire étudiant
//  Mode création : /students/new
//  Mode édition  : /students/:id/edit
// ──────────────────────────────────────────────
export {};

const mockStudent = {
  id: 1,
  firstName: 'Marie',
  lastName: 'Curie',
  email: 'marie.curie@example.com',
  createdAt: '2024-01-15T10:30:00',
  updatedAt: '2024-01-15T10:30:00',
};

// ── Mode création ────────────────────────────

describe('Student Form — création', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/students/new');
  });

  it('affiche le titre "Ajouter un étudiant"', () => {
    cy.contains('h5', 'Ajouter un étudiant').should('be.visible');
  });

  it('affiche les champs Prénom, Nom et Email', () => {
    cy.get('input[formControlName="firstName"]').should('exist');
    cy.get('input[formControlName="lastName"]').should('exist');
    cy.get('input[formControlName="email"]').should('exist');
  });

  it('soumission réussie redirige vers /students', () => {
    // Mock API — POST /api/students
    cy.intercept('POST', '/api/students', {
      statusCode: 201,
      body: { id: 3, firstName: 'Alan', lastName: 'Turing', email: 'alan@example.com',
              createdAt: '2024-03-01T00:00:00', updatedAt: '2024-03-01T00:00:00' },
    }).as('createStudent');

    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] });

    cy.get('input[formControlName="firstName"]').type('Alan');
    cy.get('input[formControlName="lastName"]').type('Turing');
    cy.get('input[formControlName="email"]').type('alan@example.com');
    cy.contains('button', 'Enregistrer').click();

    cy.wait('@createStudent');
    cy.url().should('include', '/students');
    cy.url().should('not.include', '/new');
  });

  it('le bouton Annuler redirige vers /students', () => {
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] });
    cy.contains('button', 'Annuler').click();
    cy.url().should('include', '/students');
    cy.url().should('not.include', '/new');
  });
});

// ── Mode édition ─────────────────────────────

describe('Student Form — édition', () => {
  beforeEach(() => {
    cy.login();

    // Mock API — GET /api/students/1 pour pré-remplir le formulaire
    cy.intercept('GET', '/api/students/1', {
      statusCode: 200,
      body: mockStudent,
    }).as('getStudent');

    cy.visit('/students/1/edit');
    cy.wait('@getStudent');
  });

  it('affiche le titre "Modifier l\'étudiant"', () => {
    cy.contains('h5', "Modifier l'étudiant").should('be.visible');
  });

  it('pré-remplit le formulaire avec les données de l\'étudiant', () => {
    cy.get('input[formControlName="firstName"]').should('have.value', 'Marie');
    cy.get('input[formControlName="lastName"]').should('have.value', 'Curie');
    cy.get('input[formControlName="email"]').should('have.value', 'marie.curie@example.com');
  });

  it('soumission réussie redirige vers /students', () => {
    // Mock API — PUT /api/students/1
    cy.intercept('PUT', '/api/students/1', {
      statusCode: 200,
      body: { ...mockStudent, firstName: 'Marie-Updated' },
    }).as('updateStudent');

    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] });

    cy.get('input[formControlName="firstName"]').clear().type('Marie-Updated');
    cy.contains('button', 'Enregistrer').click();

    cy.wait('@updateStudent');
    cy.url().should('include', '/students');
    cy.url().should('not.include', '/edit');
  });

  it('le bouton Annuler redirige vers /students', () => {
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] });
    cy.contains('button', 'Annuler').click();
    cy.url().should('include', '/students');
    cy.url().should('not.include', '/edit');
  });
});