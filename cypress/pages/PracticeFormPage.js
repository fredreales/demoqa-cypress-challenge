import BasePage from './BasePage';

const selectors = {
  form: '#userForm',
  firstName: '#firstName',
  lastName: '#lastName',
  email: '#userEmail',
  genderLabel: (gender) => `#genterWrapper label:contains(${gender})`,
  mobile: '#userNumber',
  dateOfBirthInput: '#dateOfBirthInput',
  datePicker: {
    container: '.react-datepicker',
    month: '.react-datepicker__month-select',
    year: '.react-datepicker__year-select',
    day: (day) => `.react-datepicker__day--0${day}:not(.react-datepicker__day--outside-month)`,
  },
  subjectsContainer: '#subjectsContainer',
  subjectsInput: '#subjectsInput',
  subjectChips: '.subjects-auto-complete__multi-value__label',
  hobbyLabel: (hobby) => `#hobbiesWrapper label:contains(${hobby})`,
  uploadPicture: '#uploadPicture',
  currentAddress: '#currentAddress',
  state: '#state',
  city: '#city',
  submit: '#submit',
  modal: {
    root: '.modal-content',
    title: '#example-modal-sizes-title-lg',
    rows: '.modal-body tbody tr',
    close: '#closeLargeModal',
  },
};

export default class PracticeFormPage extends BasePage {
  constructor() {
    super('/automation-practice-form');
    this.selectors = selectors;
  }

  fillName({ firstName, lastName }) {
    cy.get(selectors.firstName).clear();
    cy.get(selectors.firstName).type(firstName);
    cy.get(selectors.lastName).clear();
    cy.get(selectors.lastName).type(lastName);
    return this;
  }

  fillEmail(email) {
    cy.get(selectors.email).clear();
    cy.get(selectors.email).type(email);
    return this;
  }

  selectGender(gender) {
    cy.get(selectors.genderLabel(gender)).click();
    return this;
  }

  fillMobile(mobile) {
    cy.get(selectors.mobile).clear();
    cy.get(selectors.mobile).type(mobile);
    return this;
  }

  setDateOfBirth({ day, month, year }) {
    cy.get(selectors.dateOfBirthInput).click();
    cy.get(selectors.datePicker.container).should('be.visible');
    cy.get(selectors.datePicker.month).select(month);
    cy.get(selectors.datePicker.year).select(year);
    cy.get(selectors.datePicker.day(day)).click();
    cy.get(selectors.datePicker.container).should('not.exist');
    return this;
  }

  addSubjects(subjects = []) {
    subjects.forEach((subject) => {
      cy.get(selectors.subjectsInput).type(subject);
      cy.get('.subjects-auto-complete__menu').contains(subject).click();
    });
    return this;
  }

  selectHobbies(hobbies = []) {
    hobbies.forEach((hobby) => cy.get(selectors.hobbyLabel(hobby)).click());
    return this;
  }

  uploadPicture(fileName) {
    cy.get(selectors.uploadPicture).selectFile(`cypress/fixtures/uploads/${fileName}`);
    return this;
  }

  fillCurrentAddress(address) {
    cy.get(selectors.currentAddress).clear();
    cy.get(selectors.currentAddress).type(address);
    return this;
  }

  selectStateAndCity(state, city) {
    cy.chooseFromReactSelect(selectors.state, state);
    cy.chooseFromReactSelect(selectors.city, city);
    return this;
  }

  fillForm(student) {
    this.fillName(student);
    if (student.email !== undefined) this.fillEmail(student.email);
    if (student.gender) this.selectGender(student.gender);
    if (student.mobile !== undefined) this.fillMobile(student.mobile);
    if (student.dateOfBirth) this.setDateOfBirth(student.dateOfBirth);
    if (student.subjects) this.addSubjects(student.subjects);
    if (student.hobbies) this.selectHobbies(student.hobbies);
    if (student.picture) this.uploadPicture(student.picture);
    if (student.currentAddress) this.fillCurrentAddress(student.currentAddress);
    if (student.state && student.city) this.selectStateAndCity(student.state, student.city);
    return this;
  }

  submit() {
    cy.get(selectors.submit).click();
    return this;
  }

  confirmationModal() {
    return cy.get(selectors.modal.root).should('be.visible');
  }

  assertNotSubmitted() {
    cy.get(selectors.modal.root).should('not.exist');
    return this;
  }

  submittedValues() {
    return cy.get(selectors.modal.rows).then(($rows) => {
      const values = {};
      $rows.each((_, row) => {
        const cells = row.querySelectorAll('td');
        values[cells[0].innerText.trim()] = (cells[1]?.innerText || '').trim();
      });
      return values;
    });
  }

  dismissModalWithEscape() {
    cy.get('body').type('{esc}');
    cy.get(selectors.modal.root).should('not.exist');
    return this;
  }
}
