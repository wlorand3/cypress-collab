/// <reference types="cypress" />

describe('Input obstacles', () => {
  beforeEach(() => {
    cy.visit('/obstacle-course');
  });

  it.skip('should input text into the input field', () => {
    const thought = 'Ravioli are a form of pop tart.';
    cy.get('[data-test="text-input"]').type(thought);
    cy.get('[data-test="text-result"]').contains(thought);
  });

  it.skip('should control a select input', () => {
    cy.get('[data-test="select-input"]').select('Hulk');
    cy.get('[data-test="select-result"]').contains('Hulk');
  });

  it.skip('should find and control a checkbox input', () => {
    cy.get('[data-test="checkbox-tomato"]').check();
    cy.get('[data-test="checkbox-result"]').contains('Tomato');
  });

  it.skip('should find and control a radio input', () => {
    cy.get('[data-test="radio-ringo"]').check();
    cy.get('[data-test="radio-result"]').contains('Ringo');
  });

  it.skip('should find and control a color input', () => {
    cy.get('[data-test="color-input"]').invoke('val', '#00ff00').trigger('input');
    cy.get('[data-test="color-result"]').contains('#00ff00');
  });

  it.skip('should find and control a date input', () => {
    cy.get('[data-test="date-input"]').type('2021-12-30');
    cy.get('[data-test="date-result"]').contains('2021-12-30');
  });

  it.skip('should find and control a range input', () => {
    cy.get('[data-test="range-input"]').invoke('val', '6').trigger('input');
    cy.get('[data-test="range-result"]').contains('6');
  });

  it.only('should find and control a file input', () => {
    // TB: needs plugin
    //cy.get('[data-test="file-input"]').invoke('val', '~/Desktop/my-file.txt').trigger('input');
    // cy.get('[data-test="file-result"]').contains('~/Desktop/my-file.txt');
  });
});
