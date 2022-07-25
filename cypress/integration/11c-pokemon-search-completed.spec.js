/// <reference types="cypress" />

// quick & dirty JS obj for the fixture data
const pokemon = [
  { id: 1, name: 'Bumblesaur' },
  { id: 2, name: 'Charmer' },
  { id: 3, name: 'Turtle' },
];

describe('Pokémon Search', () => {
  beforeEach(() => {
    cy.visit('/pokemon-search');
    // aliases
    cy.get('[data-test="search"]').as('search');
    cy.get('[data-test="search-label"]').as('label');
    cy.intercept('/pokemon-search/api?*').as('api');
  });

  it('1- should call the API when the user types', () => {
    cy.get('@search').type('bulba');
    cy.wait('@api');
  });

  it('2- should update the query parameter', () => {
    cy.get('@search').type('squir');
    cy.wait('@api');
    cy.location('search').should('equal', '?name=squir');
  });

  it('3- should call the API with correct query parameter', () => {
    cy.get('@search').type('char');
    cy.wait('@api').then((interception) => {
      expect(interception.request.url).to.contain('name=char');
    });
  });

  it('4- should pre-populate the search field with the query parameter', () => {
    cy.visit({ url: '/pokemon-search', qs: { name: 'char' } });
    cy.get('@search').should('have.value', 'char');
  });

  it('5- should render the results to the page', () => {
    // intercept and provide local mock data
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');
    // interact with the UI via the DOM
    cy.get('@search').type('lol');
    // async api call
    cy.wait('@stubbed-api');
    // test ui results where api was called and returned data
    cy.get('[data-test="result"]').should('have.length', 3);
  });

  it('6- should link to the correct pokémon', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');

    cy.get('@search').type('lol');
    cy.wait('@stubbed-api');

    cy.get('[data-test="result"] a').each(($el, index) => {
      const { id } = pokemon[index];
      expect($el.attr('href')).to.contain('/pokemon-search/' + id);
    });
  });

  it('7- should persist the query parameter in the link to a pokémon', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');

    // error - says field is disabled
    cy.get('@search').type('lol');
    cy.wait('@stubbed-api');

    cy.get('[data-test="result"] a').each(($el) => {
      expect($el.attr('href')).to.contain('name=lol');
    });
  });

  // 2 step api example: - also api stub for passing in a query param

  it('8- should bring you to the route for the correct pokémon', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');
    cy.intercept('/pokemon-search/api/1', { fixture: 'bulbasaur.json' }).as('individual-api');

    cy.get('@search').type('bulba');
    cy.wait('@stubbed-api');

    cy.get('[data-test="result"] a').first().click();
    cy.wait('@individual-api');

    cy.location('pathname').should('contain', '/pokemon-search/1');
  });

  it('9- should immediately fetch a pokémon if a query parameter is provided', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');
    cy.visit({ url: '/pokemon-search', qs: { name: 'bulba' } });

    cy.wait('@stubbed-api').its('response.url').should('contain', '?name=bulba');
  });
});
