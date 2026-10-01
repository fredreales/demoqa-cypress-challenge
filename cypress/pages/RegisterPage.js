import BasePage, { SECRET_TYPING } from './BasePage';

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

  get firstNameInput() {
    return cy.get(selectors.firstName);
  }

  get lastNameInput() {
    return cy.get(selectors.lastName);
  }

  get userNameInput() {
    return cy.get(selectors.userName);
  }

  get passwordInput() {
    return cy.get(selectors.password);
  }

  get submitButton() {
    return cy.get(selectors.submit);
  }

  get message() {
    return cy.get(selectors.message);
  }

  visit() {
    cy.visitPage(this.path, { stubRecaptcha: true });
    return this;
  }

  fill({ firstName, lastName, userName, password }) {
    this.fillField(() => this.firstNameInput, firstName);
    this.fillField(() => this.lastNameInput, lastName);
    this.fillField(() => this.userNameInput, userName);
    this.fillField(() => this.passwordInput, password, SECRET_TYPING);
    return this;
  }

  submit() {
    this.submitButton.click();
    return this;
  }
}
