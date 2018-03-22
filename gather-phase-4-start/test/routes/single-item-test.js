const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:itemId', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:
  describe('GET', () => {
    it('displays the title and description when supplied with a valid item ID', async () => {
      const newItem = await seedItemToDatabase();
      const response = await request(app).get('/items/' + newItem._id );
      assert.include(parseTextFromHTML(response.text, '#item-title'), newItem.title);
      assert.include(parseTextFromHTML(response.text, '#item-description'), newItem.description);
    });

    it('redirects home when supplied with an invalid item ID', async () => {
      const response = await request(app).get('/items/garbageid');
      assert.equal(response.headers.location, '/');
    });
  });
});
