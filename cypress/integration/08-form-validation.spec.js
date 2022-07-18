/// <reference types="cypress" />

describe('Sign Up', () => {
  beforeEach(() => {
    cy.visit('/echo-chamber/sign-up');
    // define some aliases that will be used across tests
    cy.get('[data-test="sign-up-submit"]').as('submit');
    cy.get('[data-test="sign-up-email"]').as('email');
  });

  it('should require an email', () => {
    cy.get('@submit').click();
    // ok: check the :invalid pseudo-class for at least one field
    cy.get('[data-test="sign-up-email"]:invalid').should('have.length', 1);

    // better: check the validation message string
    cy.get('[data-test="sign-up-email"]:invalid')
      .invoke('prop', 'validationMessage')
      .should('contain', 'Please fill out this field');

    // best: check the validity object valueMissing boolean
    cy.get('[data-test="sign-up-email"]:invalid')
      .invoke('prop', 'validity')
      .its('valueMissing')
      .should('be.true');
  });

  it('should require that the email actually be an email address', () => {
    // todo: use fixtures for filling out the form (better than manual)
    cy.get('@email').type('notanemail');

    cy.get('@submit').click();
    cy.get('[data-test="sign-up-email"]:invalid').should('have.length', 1);

    // look for invalid email validation message with @
    cy.get('@email')
      .invoke('prop', 'validationMessage')
      .should('contain', "Please include an '@' in the email address.");

    // look for typeMismatch boolean from the validity object
    cy.get('[data-test="sign-up-email"]:invalid')
      .invoke('prop', 'validity')
      .its('typeMismatch')
      .should('be.true');
  });

  it('should require a password when the email is present', () => {
    // note the {enter} code to simulate keyboard press of the enter key!
    cy.get('@email').type('valid@email.com{enter}');

    // check for :invalid pseudo-class
    cy.get('[data-test="sign-up-password"]:invalid').should('have.length', 1);

    // check valueMissing from validity object - better than empty string check
    cy.get('[data-test="sign-up-password"]:invalid')
      .invoke('prop', 'validity')
      .its('valueMissing')
      .should('be.true');
  });
});
