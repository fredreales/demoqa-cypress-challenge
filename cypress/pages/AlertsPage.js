import BasePage from './BasePage';

const selectors = {
  simpleAlert: '#alertButton',
  timerAlert: '#timerAlertButton',
  confirm: '#confirmButton',
  confirmResult: '#confirmResult',
  prompt: '#promtButton',
  promptResult: '#promptResult',
};

export default class AlertsPage extends BasePage {
  constructor() {
    super('/alerts');
    this.selectors = selectors;
  }

  get simpleAlertButton() {
    return cy.get(selectors.simpleAlert);
  }

  get timerAlertButton() {
    return cy.get(selectors.timerAlert);
  }

  get confirmButton() {
    return cy.get(selectors.confirm);
  }

  get confirmResult() {
    return cy.get(selectors.confirmResult);
  }

  get promptButton() {
    return cy.get(selectors.prompt);
  }

  get promptResult() {
    return cy.get(selectors.promptResult);
  }

  clickSimpleAlert() {
    this.simpleAlertButton.click();
    return this;
  }

  clickTimerAlert() {
    this.timerAlertButton.click();
    return this;
  }

  clickConfirm() {
    this.confirmButton.click();
    return this;
  }

  clickPrompt() {
    this.promptButton.click();
    return this;
  }
}
