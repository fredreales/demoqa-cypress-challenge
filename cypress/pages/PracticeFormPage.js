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
  subjectsInput: '#subjectsInput',
  subjectsMenu: '.subjects-auto-complete__menu',
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

  get firstNameInput() {
    return cy.get(selectors.firstName);
  }

  get lastNameInput() {
    return cy.get(selectors.lastName);
  }

  get emailInput() {
    return cy.get(selectors.email);
  }

  get mobileInput() {
    return cy.get(selectors.mobile);
  }

  get dateOfBirthInput() {
    return cy.get(selectors.dateOfBirthInput);
  }

  get datePicker() {
    return cy.get(selectors.datePicker.container);
  }

  get subjectsInput() {
    return cy.get(selectors.subjectsInput);
  }

  get subjectsMenu() {
    return cy.get(selectors.subjectsMenu);
  }

  get pictureInput() {
    return cy.get(selectors.uploadPicture);
  }

  get currentAddressInput() {
    return cy.get(selectors.currentAddress);
  }

  get submitButton() {
    return cy.get(selectors.submit);
  }

  get confirmationModal() {
    return cy.get(selectors.modal.root);
  }

  genderOption(gender) {
    return cy.get(selectors.genderLabel(gender));
  }

  hobbyOption(hobby) {
    return cy.get(selectors.hobbyLabel(hobby));
  }

  fillName({ firstName, lastName }) {
    this.fillField(() => this.firstNameInput, firstName);
    this.fillField(() => this.lastNameInput, lastName);
    return this;
  }

  fillEmail(email) {
    return this.fillField(() => this.emailInput, email);
  }

  selectGender(gender) {
    this.genderOption(gender).click();
    return this;
  }

  fillMobile(mobile) {
    return this.fillField(() => this.mobileInput, mobile);
  }

  setDateOfBirth({ day, month, year }) {
    this.dateOfBirthInput.click();
    this.datePicker.should('be.visible');
    cy.get(selectors.datePicker.month).select(month);
    cy.get(selectors.datePicker.year).select(year);
    cy.get(selectors.datePicker.day(day)).click();
    this.datePicker.should('not.exist');
    return this;
  }

  addSubjects(subjects = []) {
    subjects.forEach((subject) => {
      this.subjectsInput.type(subject);
      this.subjectsMenu.contains(subject).click();
    });
    return this;
  }

  selectHobbies(hobbies = []) {
    hobbies.forEach((hobby) => this.hobbyOption(hobby).click());
    return this;
  }

  uploadPicture(fileName) {
    this.pictureInput.selectFile(`cypress/fixtures/uploads/${fileName}`);
    return this;
  }

  fillCurrentAddress(address) {
    return this.fillField(() => this.currentAddressInput, address);
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
    this.submitButton.click();
    return this;
  }

  assertNotSubmitted() {
    this.confirmationModal.should('not.exist');
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
    this.confirmationModal.should('not.exist');
    return this;
  }
}
