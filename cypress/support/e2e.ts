/// <reference types="cypress" />
/// <reference path="./commands.ts" />

// Commandes personnalisées
Cypress.Commands.add('login', () => {
  // Simule un utilisateur connecté en injectant un token dans localStorage
  cy.window().then((win) => {
    win.localStorage.setItem('token', 'fake-jwt-token');
  });
});