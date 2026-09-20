import { buildAccount } from '../../utils/dataFactory';

const FIRST_ISBN = '9781449325862';

describe('Book Store API — account lifecycle', { tags: ['@creates-account'] }, () => {
  const account = buildAccount();
  let userId;
  let token;

  after(() => {
    if (!userId || !token) return;
    cy.asBookStoreUser(token, { method: 'DELETE', url: `/Account/v1/User/${userId}` });
  });

  it('registers a new account with an empty collection', () => {
    cy.createUserByApi(account).then(({ status, body }) => {
      expect(status).to.equal(201);
      expect(body.username).to.equal(account.userName);
      expect(body.userID).to.be.a('string').and.not.be.empty;
      expect(body.books).to.be.an('array').that.is.empty;
      userId = body.userID;
    });
  });

  it('refuses a user name that already exists', () => {
    cy.createUserByApi(account).then(({ status, body }) => {
      expect(status).to.equal(406);
      expect(body.code).to.equal('1204');
      expect(body.message).to.equal('User exists!');
    });
  });

  it('issues a token for valid credentials', () => {
    cy.bookStoreToken(account).then(({ status, body }) => {
      expect(status).to.equal(200);
      expect(body.status).to.equal('Success');
      expect(body.result).to.equal('User authorized successfully.');
      expect(body.token).to.be.a('string').and.not.be.empty;
      token = body.token;
    });
  });

  it('returns the profile of the authenticated user', () => {
    cy.asBookStoreUser(token, { method: 'GET', url: `/Account/v1/User/${userId}` }).then(
      ({ status, body }) => {
        expect(status).to.equal(200);
        expect(body.username).to.equal(account.userName);
        expect(body.books).to.be.an('array');
      },
    );
  });
});

describe('Book Store API — book collection', { tags: ['@creates-account'] }, () => {
  const account = buildAccount();
  let userId;
  let token;

  before(() => {
    cy.createUserByApi(account).then(({ body }) => {
      userId = body.userID;
      cy.bookStoreToken(account).then((response) => {
        token = response.body.token;
      });
    });
  });

  after(() => {
    if (!userId || !token) return;
    cy.asBookStoreUser(token, { method: 'DELETE', url: `/Account/v1/User/${userId}` });
  });

  it('adds a book to the collection', () => {
    cy.asBookStoreUser(token, {
      method: 'POST',
      url: '/BookStore/v1/Books',
      body: { userId, collectionOfIsbns: [{ isbn: FIRST_ISBN }] },
    }).then(({ status, body }) => {
      expect(status).to.equal(201);
      expect(body.books.map((book) => book.isbn)).to.include(FIRST_ISBN);
    });
  });

  it('shows the added book on the profile', () => {
    cy.asBookStoreUser(token, { method: 'GET', url: `/Account/v1/User/${userId}` }).then(
      ({ body }) => {
        expect(body.books.map((book) => book.isbn)).to.deep.equal([FIRST_ISBN]);
      },
    );
  });

  it('refuses to add the same book twice', () => {
    cy.asBookStoreUser(token, {
      method: 'POST',
      url: '/BookStore/v1/Books',
      body: { userId, collectionOfIsbns: [{ isbn: FIRST_ISBN }] },
    }).then(({ status, body }) => {
      expect(status).to.equal(400);
      expect(body.code).to.equal('1210');
    });
  });

  it('removes the book from the collection', () => {
    cy.asBookStoreUser(token, {
      method: 'DELETE',
      url: '/BookStore/v1/Book',
      body: { isbn: FIRST_ISBN, userId },
    }).then(({ status }) => {
      expect(status).to.equal(204);
    });

    cy.asBookStoreUser(token, { method: 'GET', url: `/Account/v1/User/${userId}` }).then(
      ({ body }) => {
        expect(body.books).to.be.an('array').that.is.empty;
      },
    );
  });
});
