/// <reference types="cypress" />

// some mock data - quick and dirty (better: make a fixture file)
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
    // pattern: do intercept alias if used in multiple tests
    cy.intercept('/pokemon-search/api?*').as('api');
  });

  // Dev Note: these seem to be step-by-step tests - small focused tasks - for learning, not real-world
  it('1- should call the API when the user types', () => {
    cy.get('@search').type('ivy');
    // just test if API is called
    cy.wait('@api');
  });

  it('2- should update the query parameter', () => {
    cy.get('@search').type('ivy');
    cy.wait('@api');
    // reminder de two args for .should() is common
    // know you can also use .contains() here
    cy.location('search').should('equal', '?name=ivy');
  });

  // tests if did fire the right API request
  it('3- should call the API with correct query parameter', () => {
    cy.get('@search').type('ivy');
    // a- test a bit of the request

    // two ways demoed to do this:
    // alt: expect(interception.request.url).to.contain('name=char');
    // cy.wait('@api').its('request.url').should('contain', 'name=ivy');
    // b- test a bit of the response
  });

  it('4- should pre-populate the search field with the query parameter', () => {
    // know cy.visit can also take an obj to specify the url and query string (qs)
    cy.visit({ url: '/pokemon-search', qs: { name: 'char' } });
    cy.wait('@api').its('request.url').should('contain', 'name=char');
  });

  // Dev Note: start copy and paste solutions from completed file
  it('5- should render the results to the page', () => {
    // a- intercept response with local on the page mock data - see above for pokemon []
    // - this stubs an api - no need for api server to be running;
    // - with .intercept, we are effectively "eating" the response and issuing our own response
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');
    // a2- know you can also test one piece of the mock data and use the fixture: keyword
    //  - note: this works only if there is a file named bulbasaur.json in the fixtures/ dir
    // cy.intercept('/pokemon-search/api/1', {fixture: 'bulbasaur'}) // inline fixture or external JSON file
    cy.get('@search').type('lol');
    // b- wait for the api call - this ensures the api got called
    cy.wait('@stubbed-api');
    // c- assert : good example of checking the length of the mock data
    cy.get('[data-test="result"]').should('have.length', 3); // tests the search results
  });

  it('6- should link to the correct pokémon from results', () => {
    // repeat de intercept to stub the api
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');
    // ui
    cy.get('@search').type('lol');
    // wait calls the api with fixture
    cy.wait('@stubbed-api');
    // * xtra code: loop thru each result and check it's id
    cy.get('[data-test="result"] a').each(($el, index) => {
      const { id } = pokemon[index];
      expect($el.attr('href')).to.contain('/pokemon-search/' + id);
    });
  });

  // dev note: weird: this one makes no sense as 'lol' not in the search results
  // also very much the same as #6, so don't troubleshoot
  it('7- should persist the query parameter in the [results] link to a pokémon', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');

    cy.get('@search').type('lol');
    cy.wait('@stubbed-api');

    cy.get('[data-test="result"] a').each(($el) => {
      expect($el.attr('href')).to.contain('name=lol');
    });
  });

  it('8- should bring you to the route for the correct pokémon in the render pane', () => {
    // 2 step api example: - also api stub for passing in a query param
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');
    cy.intercept('/pokemon-search/api/1', { fixture: 'bulbasaur.json' }).as('individual-api');

    cy.get('@search').type('bulba');
    // api call #1
    cy.wait('@stubbed-api');

    cy.get('[data-test="result"] a').first().click();
    // api call #2
    cy.wait('@individual-api');

    cy.location('pathname').should('contain', '/pokemon-search/1');
  });

  it.only('9- should immediately fetch a pokémon if a url query parameter is provided', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');

    // how logic? - check the cy.location('pathmame') - nope
    // using the qs for query-string property
    cy.visit({ url: '/pokemon-search', qs: { name: 'bulba' } });
    // nice check of the [mock] response object -- vs always the request object
    cy.wait('@stubbed-api').its('response.url').should('contain', '?name=bulba');
  });
});
