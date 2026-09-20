const REQUIRED_BOOK_FIELDS = [
  'isbn',
  'title',
  'subTitle',
  'author',
  'publisher',
  'pages',
  'description',
  'website',
];

const api = (options) => cy.request({ failOnStatusCode: false, ...options });

describe('Book Store API — catalogue', () => {
  it('returns the full catalogue', { tags: ['@smoke'] }, () => {
    api({ method: 'GET', url: '/BookStore/v1/Books' }).then(({ status, body }) => {
      expect(status).to.equal(200);
      expect(body.books).to.be.an('array').and.not.be.empty;

      body.books.forEach((book) => {
        REQUIRED_BOOK_FIELDS.forEach((field) => {
          expect(book, `book ${book.isbn}`).to.have.property(field);
          expect(String(book[field]), `${field} of ${book.isbn}`).to.not.be.empty;
        });
        expect(book.pages, `pages of ${book.isbn}`).to.be.a('number').and.be.greaterThan(0);
      });
    });
  });

  it('issues a unique ISBN per book', () => {
    api({ method: 'GET', url: '/BookStore/v1/Books' }).then(({ body }) => {
      const isbns = body.books.map((book) => book.isbn);
      expect(new Set(isbns).size, 'unique ISBNs').to.equal(isbns.length);
    });
  });

  it('returns a single book matching its entry in the catalogue', () => {
    api({ method: 'GET', url: '/BookStore/v1/Books' }).then(({ body }) => {
      const expected = body.books[0];

      api({ method: 'GET', url: `/BookStore/v1/Book?ISBN=${expected.isbn}` }).then((response) => {
        expect(response.status).to.equal(200);
        REQUIRED_BOOK_FIELDS.forEach((field) => {
          expect(response.body[field], field).to.deep.equal(expected[field]);
        });
      });
    });
  });

  it('rejects an ISBN that is not in the catalogue', () => {
    api({ method: 'GET', url: '/BookStore/v1/Book?ISBN=not-a-real-isbn' }).then(
      ({ status, body }) => {
        expect(status).to.equal(400);
        expect(body.code).to.equal('1205');
        expect(body.message).to.equal('ISBN supplied is not available in Books Collection!');
      },
    );
  });
});

describe('Book Store API — authorization', () => {
  const UNKNOWN_USER = { userName: 'not_a_real_user_98765', password: 'NotARealPassword@1' };

  it('refuses to add books to a collection without a token', { tags: ['@smoke'] }, () => {
    api({
      method: 'POST',
      url: '/BookStore/v1/Books',
      body: { userId: 'anonymous', collectionOfIsbns: [{ isbn: '9781449325862' }] },
    }).then(({ status, body }) => {
      expect(status).to.equal(401);
      expect(body.code).to.equal('1200');
      expect(body.message).to.equal('User not authorized!');
    });
  });

  it('refuses to delete a book from a collection without a token', () => {
    api({
      method: 'DELETE',
      url: '/BookStore/v1/Book',
      body: { isbn: '9781449325862', userId: 'anonymous' },
    }).then(({ status, body }) => {
      expect(status).to.equal(401);
      expect(body.code).to.equal('1200');
    });
  });

  it('refuses to read a user profile without a token', () => {
    api({
      method: 'GET',
      url: '/Account/v1/User/00000000-0000-0000-0000-000000000000',
    }).then(({ status, body }) => {
      expect(status).to.equal(401);
      expect(body.code).to.equal('1200');
    });
  });

  it('issues no token for credentials that do not belong to an account', () => {
    api({ method: 'POST', url: '/Account/v1/GenerateToken', body: UNKNOWN_USER }).then(
      ({ body }) => {
        expect(body.token, 'token').to.be.null;
        expect(body.expires, 'expiry').to.be.null;
        expect(body.status).to.equal('Failed');
        expect(body.result).to.equal('User authorization failed.');
      },
    );
  });

  it('reports an unknown account as not found', () => {
    api({ method: 'POST', url: '/Account/v1/Authorized', body: UNKNOWN_USER }).then(
      ({ status, body }) => {
        expect(status).to.equal(404);
        expect(body.code).to.equal('1207');
        expect(body.message).to.equal('User not found!');
      },
    );
  });

  it('enforces the password policy when creating an account', () => {
    api({
      method: 'POST',
      url: '/Account/v1/User',
      body: { userName: `policy_probe_${Date.now()}`, password: 'weak' },
    }).then(({ status, body }) => {
      expect(status).to.equal(400);
      expect(body.code).to.equal('1300');
      expect(body.message).to.contain(
        'Passwords must have at least one non alphanumeric character',
      );
    });
  });
});
