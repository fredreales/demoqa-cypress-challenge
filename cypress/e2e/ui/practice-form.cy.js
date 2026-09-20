import PracticeFormPage from '../../pages/PracticeFormPage';
import { buildStudent, formatDateOfBirth } from '../../utils/dataFactory';

const practiceForm = new PracticeFormPage();

describe('Student Registration Form', () => {
  beforeEach(() => {
    practiceForm.visit();
  });

  it(
    'submits a complete registration and echoes every value back in the confirmation',
    { tags: ['@smoke'] },
    () => {
      const student = buildStudent();

      practiceForm.fillForm(student).submit();

      practiceForm.confirmationModal().should('contain', 'Thanks for submitting the form');
      practiceForm.submittedValues().should((submitted) => {
        expect(submitted['Student Name']).to.equal(`${student.firstName} ${student.lastName}`);
        expect(submitted['Student Email']).to.equal(student.email);
        expect(submitted.Gender).to.equal(student.gender);
        expect(submitted.Mobile).to.equal(student.mobile);
        expect(submitted['Date of Birth']).to.equal(formatDateOfBirth(student.dateOfBirth));
        expect(submitted.Subjects).to.equal(student.subjects.join(', '));
        expect(submitted.Hobbies).to.equal(student.hobbies.join(', '));
        expect(submitted.Picture).to.equal(student.picture);
        expect(submitted.Address).to.equal(student.currentAddress);
        expect(submitted['State and City']).to.equal(`${student.state} ${student.city}`);
      });

      practiceForm.dismissModalWithEscape();
    },
  );

  it('submits successfully when only the mandatory fields are provided', () => {
    const student = buildStudent({
      email: undefined,
      dateOfBirth: undefined,
      subjects: undefined,
      hobbies: undefined,
      picture: undefined,
      currentAddress: undefined,
      state: undefined,
      city: undefined,
    });

    practiceForm.fillForm(student).submit();

    practiceForm.submittedValues().should((submitted) => {
      expect(submitted['Student Name']).to.equal(`${student.firstName} ${student.lastName}`);
      expect(submitted.Mobile).to.equal(student.mobile);
    });
  });

  it('blocks submission when required fields are empty', () => {
    practiceForm.submit();

    practiceForm.assertNotSubmitted();
    cy.get(practiceForm.selectors.firstName).shouldBeInvalid();
    cy.get(practiceForm.selectors.lastName).shouldBeInvalid();
    cy.get(practiceForm.selectors.mobile).shouldBeInvalid();
  });

  it('blocks submission when the mobile number contains letters', () => {
    practiceForm.fillName(buildStudent()).selectGender('Male').fillMobile('55a5b12345').submit();

    practiceForm.assertNotSubmitted();
    cy.get(practiceForm.selectors.mobile).shouldBeInvalid();
  });

  it('caps the mobile number at 10 characters', () => {
    practiceForm.fillMobile('5551234567890');

    cy.get(practiceForm.selectors.mobile).should('have.value', '5551234567');
  });

  describe('email validation', () => {
    it('rejects malformed addresses', () => {
      cy.fixture('emailValidation').then(({ invalid }) => {
        invalid.forEach(({ value }) => {
          practiceForm.fillEmail(value);
          cy.get(practiceForm.selectors.email).shouldBeInvalid();
        });
      });
    });

    it('accepts a well-formed address', () => {
      practiceForm.fillEmail('ada.lovelace@example.com');
      cy.get(practiceForm.selectors.email).shouldBeValid();
    });
  });
});
