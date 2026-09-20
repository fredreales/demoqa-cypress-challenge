import BasePage from './BasePage';

const selectors = {
  userName: '#userName',
  password: '#password',
  submit: '#login',
  newUser: '#newUser',
  error: '#name',
};

export default class LoginPage extends BasePage {
  constructor() {
    super('/login');
    this.selectors = selectors;
  }

  fillCredentials(userName, password) {
    cy.get(selectors.userName).clear();
    if (userName) cy.get(selectors.userName).type(userName);
    cy.get(selectors.password).clear();
    if (password) cy.get(selectors.password).type(password, { log: false });
    return this;
  }

  submit() {
    cy.get(selectors.submit).click();
    return this;
  }

  goToRegistration() {
    cy.get(selectors.newUser).click();
    return this;
  }

  error() {
    return cy.get(selectors.error);
  }
}
