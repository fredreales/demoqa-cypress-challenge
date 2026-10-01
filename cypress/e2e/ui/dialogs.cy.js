import AlertsPage from '../../pages/AlertsPage';
import ModalDialogsPage from '../../pages/ModalDialogsPage';

const alerts = new AlertsPage();
const modals = new ModalDialogsPage();

describe('Browser dialogs', () => {
  beforeEach(() => {
    alerts.visit();
  });

  it('shows a simple alert with the expected message', { tags: ['@smoke'] }, () => {
    const onAlert = cy.stub().as('alert');
    cy.on('window:alert', onAlert);

    alerts.clickSimpleAlert();

    cy.get('@alert').should('have.been.calledOnceWith', 'You clicked a button');
  });

  it('shows the delayed alert after its 5 second timer', () => {
    const onAlert = cy.stub().as('timerAlert');
    cy.on('window:alert', onAlert);

    alerts.clickTimerAlert();

    cy.get('@timerAlert', { timeout: 10000 }).should(
      'have.been.calledWith',
      'This alert appeared after 5 seconds',
    );
  });

  it('records the result of accepting a confirm dialog', () => {
    cy.on('window:confirm', () => true);

    alerts.clickConfirm();

    alerts.confirmResult.should('have.text', 'You selected Ok');
  });

  it('records the result of dismissing a confirm dialog', () => {
    cy.on('window:confirm', () => false);

    alerts.clickConfirm();

    alerts.confirmResult.should('have.text', 'You selected Cancel');
  });

  it('echoes the text entered into a prompt dialog', () => {
    cy.window().then((win) => cy.stub(win, 'prompt').returns('Ada'));

    alerts.clickPrompt();

    alerts.promptResult.should('have.text', 'You entered Ada');
  });

  it('shows no result when the prompt is cancelled', () => {
    cy.window().then((win) => cy.stub(win, 'prompt').returns(null));

    alerts.clickPrompt();

    alerts.promptResult.should('not.exist');
  });
});

describe('Modal dialogs', () => {
  beforeEach(() => {
    modals.visit();
  });

  it('opens and closes the small modal', { tags: ['@smoke'] }, () => {
    modals.openSmall();

    modals.modal.should('be.visible').within(() => {
      modals.title.should('have.text', 'Small Modal');
      modals.body.should('contain', 'small modal');
    });

    modals.close('small');
  });

  it('opens and closes the large modal', () => {
    modals.openLarge();

    modals.modal.should('be.visible').within(() => {
      modals.title.should('have.text', 'Large Modal');
      modals.body.should('contain', 'Lorem Ipsum');
    });

    modals.close('large');
  });

  it('opens only one modal at a time', () => {
    modals.openSmall();
    modals.modal.should('be.visible');
    modals.modal.should('have.length', 1);
    modals.close('small');

    modals.openLarge();
    modals.modal.should('have.length', 1);
  });
});
