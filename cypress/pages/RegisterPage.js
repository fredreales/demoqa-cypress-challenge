import BasePage from './BasePage';

const selectors = {
  firstName: '#firstname',
  lastName: '#lastname',
  userName: '#userName',
  password: '#password',
  submit: '#register',
  backToLogin: '#gotologin',
  message: '#name',
};

export default class RegisterPage extends BasePage {
  constructor() {
    super('/register');
    this.selectors = selectors;
  }

  visit() {
    cy.visitPage(this.path, { stubRecaptcha: true });
    return this;
  }

  fill({ firstName, lastName, userName, password }) {
    const fields = [
      [selectors.firstName, firstName],
      [selectors.lastName, lastName],
      [selectors.userName, userName],
      [selectors.password, password],
    ];
    fields.forEach(([selector, value]) => {
      if (value === undefined) return;
      cy.get(selector).clear();
      if (value !== '') cy.get(selector).type(value);
    });
    return this;
  }

  submit() {
    cy.get(selectors.submit).click();
    return this;
  }

  message() {
    return cy.get(selectors.message);
  }
}
