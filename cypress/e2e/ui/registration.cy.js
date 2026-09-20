import RegisterPage from '../../pages/RegisterPage';

const register = new RegisterPage();

describe('Book Store — registration', () => {
  beforeEach(() => {
    register.visit();
  });

  it('marks every field invalid when the form is submitted empty', () => {
    register.submit();

    [
      register.selectors.firstName,
      register.selectors.lastName,
      register.selectors.userName,
      register.selectors.password,
    ].forEach((field) => cy.get(field).should('have.class', 'is-invalid'));
    cy.location('pathname').should('equal', '/register');
  });
});
