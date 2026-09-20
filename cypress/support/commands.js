Cypress.Commands.add('suppressAdSlots', () => {
  cy.document().then((doc) => {
    if (doc.getElementById('cy-ad-suppressor')) return;
    const style = doc.createElement('style');
    style.id = 'cy-ad-suppressor';
    style.innerHTML = `
      #fixedban, #RightSide_Advertisement, footer,
      [id^="Ad.Plus"], [id^="google_ads_iframe"], .Advertisement-Section,
      iframe[id*="google_ads"], iframe[src*="doubleclick"] { display: none !important; }
      body { padding-bottom: 0 !important; }
    `;
    doc.head.appendChild(style);
  });
});

const RECAPTCHA_TOKEN = 'stubbed-token';

const recaptchaStub = () => ({
  ready: (callback) => callback(),
  execute: () => Promise.resolve(RECAPTCHA_TOKEN),
  render: () => 'stubbed-widget',
  reset: () => {},
  getResponse: () => RECAPTCHA_TOKEN,
  enterprise: {
    ready: (callback) => callback(),
    execute: () => Promise.resolve(RECAPTCHA_TOKEN),
  },
});

Cypress.Commands.add('visitPage', (path, options = {}) => {
  const { stubRecaptcha = false, onBeforeLoad, ...visitOptions } = options;

  if (stubRecaptcha) {
    cy.intercept('GET', 'https://www.google.com/recaptcha/**', { statusCode: 200, body: '' });
  }

  cy.visit(path, {
    ...visitOptions,
    onBeforeLoad(win) {
      if (stubRecaptcha) {
        const stub = recaptchaStub();
        Object.defineProperty(win, 'grecaptcha', {
          configurable: true,
          get: () => stub,
          set: () => {},
        });
      }
      if (onBeforeLoad) onBeforeLoad(win);
    },
  });
  cy.suppressAdSlots();
});

Cypress.Commands.add('chooseFromReactSelect', (containerSelector, value) => {
  cy.get(containerSelector).should('be.visible').click();
  cy.get(`${containerSelector} input`).first().type(value, { force: true });
  cy.get('[class*="-menu"]', { timeout: 10000 }).contains('[class*="option"]', value).click();
});

Cypress.Commands.add('shouldBeInvalid', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).should(($el) => {
    expect($el[0].checkValidity(), `${$el.attr('id')} passes HTML5 validation`).to.equal(false);
  });
  return cy.wrap(subject);
});

Cypress.Commands.add('shouldBeValid', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).should(($el) => {
    expect($el[0].checkValidity(), `${$el.attr('id')} passes HTML5 validation`).to.equal(true);
  });
  return cy.wrap(subject);
});

Cypress.Commands.add('createUserByApi', (account) =>
  cy.request({
    method: 'POST',
    url: '/Account/v1/User',
    body: account,
    failOnStatusCode: false,
  }),
);

Cypress.Commands.add('bookStoreToken', (account) =>
  cy.request({
    method: 'POST',
    url: '/Account/v1/GenerateToken',
    body: account,
    failOnStatusCode: false,
  }),
);

Cypress.Commands.add('asBookStoreUser', (token, options) =>
  cy.request({
    failOnStatusCode: false,
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  }),
);

Cypress.Commands.add('signInByUi', (account) => {
  cy.session(
    account.userName,
    () => {
      cy.visitPage('/login');
      cy.get('#userName').type(account.userName);
      cy.get('#password').type(account.password, { log: false });
      cy.get('#login').click();
      cy.location('pathname', { timeout: 15000 }).should('equal', '/profile');
    },
    { cacheAcrossSpecs: true },
  );
});

Cypress.Commands.add('loginByUi', (account) => {
  cy.visitPage('/login');

  cy.get('#userName').type(account.userName);
  cy.get('#password').type(account.password, { log: false });
  cy.get('#login').click();

  return cy.location('pathname', { timeout: 15000 }).should('equal', '/profile');
});
