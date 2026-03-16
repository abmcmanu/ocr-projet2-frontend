// ──────────────────────────────────────────────
//  Tests E2E — Liste des étudiants (/students)
// ──────────────────────────────────────────────

describe('Student List', () => {
  beforeEach(() => {
    // Simule un utilisateur connecté
    cy.login();

    // Mock API — GET /api/students
    cy.intercept('GET', '/api/students', { fixture: 'students.json' }).as('getStudents');

    cy.visit('/students');
    cy.wait('@getStudents');
  });

  it('affiche le titre et les boutons de la page', () => {
    cy.contains('h2', 'Liste des étudiants').should('be.visible');
    cy.contains('button', 'Ajouter un étudiant').should('be.visible');
    cy.contains('button', 'Déconnexion').should('be.visible');
  });

  it('affiche la liste des étudiants dans le tableau', () => {
    // Angular Material rend mat-row comme attribut sur <tr>, pas comme balise
    cy.get('tr[mat-row]').should('have.length', 2);
    cy.contains('td[mat-cell]', 'Marie').should('be.visible');
    cy.contains('td[mat-cell]', 'Curie').should('be.visible');
    cy.contains('td[mat-cell]', 'marie.curie@example.com').should('be.visible');
  });

  it('le bouton "Ajouter un étudiant" navigue vers /students/new', () => {
    cy.contains('button', 'Ajouter un étudiant').click();
    cy.url().should('include', '/students/new');
  });

  it('le bouton détail navigue vers /students/:id', () => {
    cy.intercept('GET', '/api/students/1', {
      statusCode: 200,
      body: {
        id: 1,
        firstName: 'Marie',
        lastName: 'Curie',
        email: 'marie.curie@example.com',
        createdAt: '2024-01-15T10:30:00',
        updatedAt: '2024-01-15T10:30:00',
      },
    }).as('getStudent');

    cy.get('tr[mat-row]').first().find('button[title="Détail"]').click();
    cy.url().should('include', '/students/1');
  });

  it('le bouton Déconnexion redirige vers /login', () => {
    cy.contains('button', 'Déconnexion').click();
    cy.url().should('include', '/login');
    cy.window().its('localStorage').invoke('getItem', 'token').should('be.null');
  });
});
