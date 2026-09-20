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

  fill({ fullName, email, currentAddress, permanentAddress }) {
    const entries = [
      [selectors.fullName, fullName],
      [selectors.email, email],
      [selectors.currentAddress, currentAddress],
      [selectors.permanentAddress, permanentAddress],
    ];
    entries.forEach(([selector, value]) => {
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

  output() {
    return cy.get(selectors.output.root);
  }
}
