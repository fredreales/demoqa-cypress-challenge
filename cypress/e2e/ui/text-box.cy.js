import TextBoxPage from '../../pages/TextBoxPage';

const textBox = new TextBoxPage();

const submission = {
  fullName: 'Ada Lovelace',
  email: 'ada.lovelace@example.com',
  currentAddress: '12 Analytical Engine Street',
  permanentAddress: '4 Difference Engine Road',
};

describe('Text Box', () => {
  beforeEach(() => {
    textBox.visit();
  });

  it('echoes the submitted values in the output panel', { tags: ['@smoke'] }, () => {
    textBox.fill(submission).submit();

    cy.get(textBox.selectors.output.name).should('contain', submission.fullName);
    cy.get(textBox.selectors.output.email).should('contain', submission.email);
    cy.get(textBox.selectors.output.currentAddress).should('contain', submission.currentAddress);
    cy.get(textBox.selectors.output.permanentAddress).should(
      'contain',
      submission.permanentAddress,
    );
  });

  it('renders no output panel before the first submission', () => {
    cy.get(textBox.selectors.output.name).should('not.exist');
  });

  it('accepts a submission with only optional fields left blank', () => {
    textBox.fill({ fullName: 'Grace Hopper' }).submit();

    cy.get(textBox.selectors.output.name).should('contain', 'Grace Hopper');
    cy.get(textBox.selectors.output.email).should('not.exist');
  });

  it('rejects an invalid email and does not publish the new values', () => {
    textBox.fill({ ...submission, email: 'ada.lovelace@' }).submit();

    cy.get(textBox.selectors.email).should('have.class', 'field-error');
    textBox.output().should('not.contain', submission.fullName);
  });

  it('preserves multi-line addresses', () => {
    const multiLine = 'Line one{enter}Line two';

    cy.get(textBox.selectors.fullName).type('Grace Hopper');
    cy.get(textBox.selectors.currentAddress).type(multiLine);
    textBox.submit();

    cy.get(textBox.selectors.output.currentAddress).should('contain', 'Line one');
    cy.get(textBox.selectors.output.currentAddress).should('contain', 'Line two');
  });
});
