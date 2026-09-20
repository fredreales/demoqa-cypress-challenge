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

  clickSimpleAlert() {
    cy.get(selectors.simpleAlert).click();
    return this;
  }

  clickTimerAlert() {
    cy.get(selectors.timerAlert).click();
    return this;
  }

  clickConfirm() {
    cy.get(selectors.confirm).click();
    return this;
  }

  clickPrompt() {
    cy.get(selectors.prompt).click();
    return this;
  }
}
