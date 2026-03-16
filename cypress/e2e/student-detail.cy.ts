/// <reference types="cypress" />
/// <reference path="../support/commands.ts" />
// ──────────────────────────────────────────────
//  Tests E2E — Détail d'un étudiant (/students/:id)
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

describe('Student Detail', () => {
  beforeEach(() => {
    cy.login();

    // Mock API — GET /api/students/1
    cy.intercept('GET', '/api/students/1', {
      statusCode: 200,
      body: mockStudent,
    }).as('getStudent');

    cy.visit('/students/1');
    cy.wait('@getStudent');
  });

  it('affiche le nom complet de l\'étudiant', () => {
    cy.contains('mat-card-title', 'Marie Curie').should('be.visible');
  });

  it('affiche l\'email de l\'étudiant', () => {
    cy.contains('marie.curie@example.com').should('be.visible');
  });

  it('affiche les dates de création et modification', () => {
    cy.contains('Créé le').should('be.visible');
    cy.contains('Modifié le').should('be.visible');
  });

  it('le bouton Modifier navigue vers /students/1/edit', () => {
    cy.intercept('GET', '/api/students/1', { statusCode: 200, body: mockStudent });
    cy.contains('button', 'Modifier').click();
    cy.url().should('include', '/students/1/edit');
  });

  it('le bouton Retour à la liste navigue vers /students', () => {
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] });
    cy.contains('button', 'Retour à la liste').click();
    cy.url().should('include', '/students');
    cy.url().should('not.include', '/students/1');
  });
});