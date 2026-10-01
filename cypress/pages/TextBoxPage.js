import BasePage from './BasePage';

const selectors = {
  fullName: '#userName',
  email: '#userEmail',
  currentAddress: '#currentAddress',
  permanentAddress: '#permanentAddress',
  submit: '#submit',
  output: {
    root: '#output',
    name: '#output #name',
    email: '#output #email',
    currentAddress: '#output #currentAddress',
    permanentAddress: '#output #permanentAddress',
  },
};

export default class TextBoxPage extends BasePage {
  constructor() {
    super('/text-box');
    this.selectors = selectors;
  }

  get fullNameInput() {
    return cy.get(selectors.fullName);
  }

  get emailInput() {
    return cy.get(selectors.email);
  }

  get currentAddressInput() {
    return cy.get(selectors.currentAddress);
  }

  get permanentAddressInput() {
    return cy.get(selectors.permanentAddress);
  }

  get submitButton() {
    return cy.get(selectors.submit);
  }

  get output() {
    return cy.get(selectors.output.root);
  }

  get nameOutput() {
    return cy.get(selectors.output.name);
  }

  get emailOutput() {
    return cy.get(selectors.output.email);
  }

  get currentAddressOutput() {
    return cy.get(selectors.output.currentAddress);
  }

  get permanentAddressOutput() {
    return cy.get(selectors.output.permanentAddress);
  }

  fill({ fullName, email, currentAddress, permanentAddress }) {
    this.fillField(() => this.fullNameInput, fullName);
    this.fillField(() => this.emailInput, email);
    this.fillField(() => this.currentAddressInput, currentAddress);
    this.fillField(() => this.permanentAddressInput, permanentAddress);
    return this;
  }

  submit() {
    this.submitButton.click();
    return this;
  }
}
