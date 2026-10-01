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

    textBox.nameOutput.should('contain', submission.fullName);
    textBox.emailOutput.should('contain', submission.email);
    textBox.currentAddressOutput.should('contain', submission.currentAddress);
    textBox.permanentAddressOutput.should('contain', submission.permanentAddress);
  });

  it('renders no output panel before the first submission', () => {
    textBox.nameOutput.should('not.exist');
  });

  it('accepts a submission with only optional fields left blank', () => {
    textBox.fill({ fullName: 'Grace Hopper' }).submit();

    textBox.nameOutput.should('contain', 'Grace Hopper');
    textBox.emailOutput.should('not.exist');
  });

  it('rejects an invalid email and does not publish the new values', () => {
    textBox.fill({ ...submission, email: 'ada.lovelace@' }).submit();

    textBox.emailInput.should('have.class', 'field-error');
    textBox.output.should('not.contain', submission.fullName);
  });

  it('preserves multi-line addresses', () => {
    const multiLine = 'Line one{enter}Line two';

    textBox.fullNameInput.type('Grace Hopper');
    textBox.currentAddressInput.type(multiLine);
    textBox.submit();

    textBox.currentAddressOutput.should('contain', 'Line one');
    textBox.currentAddressOutput.should('contain', 'Line two');
  });
});
