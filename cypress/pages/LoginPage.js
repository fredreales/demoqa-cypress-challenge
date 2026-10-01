import BasePage, { SECRET_TYPING } from './BasePage';

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

  get userNameInput() {
    return cy.get(selectors.userName);
  }

  get passwordInput() {
    return cy.get(selectors.password);
  }

  get submitButton() {
    return cy.get(selectors.submit);
  }

  get newUserButton() {
    return cy.get(selectors.newUser);
  }

  get errorMessage() {
    return cy.get(selectors.error);
  }

  fillCredentials(userName, password) {
    this.fillField(() => this.userNameInput, userName);
    this.fillField(() => this.passwordInput, password, SECRET_TYPING);
    return this;
  }

  submit() {
    this.submitButton.click();
    return this;
  }

  goToRegistration() {
    this.newUserButton.click();
    return this;
  }
}
