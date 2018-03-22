const {assert} = require('chai');
const request = require('supertest');
const Item = require('../../models/item');
const app = require('../../app');

const {parseTextFromHTML, parseValueFromHTML, buildItemObject, seedItemToDatabase, findImageElementBySource} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/update', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:
  describe('GET', () => {
    it('redirects to homepage with an invalid item ID', async () => {
      const response = await request(app).get('/items/garbageid/update');
      assert.equal(response.headers.location, '/');
    });

    it('renders when supplied with a valid item ID', async () => {
      const updateItem = await seedItemToDatabase();
      const response = await request(app).get('/items/' + updateItem._id + '/update');
      assert.include(parseValueFromHTML(response.text, 'input#title-input'), updateItem.title);
      assert.include(parseValueFromHTML(response.text, 'textarea#description-input'), updateItem.description);
      assert.include(parseValueFromHTML(response.text, 'input#imageUrl-input'), updateItem.imageUrl);
    });
  });

  describe('POST', () => {
    it('redirects to single item view', async () => {
      const item = await seedItemToDatabase();
      const updateItem = buildItemObject();
      const response = await request(app)
        .post('/items/'+ item._id +'/update')
        .type('form')
        .send(updateItem);
      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/items/'+ item._id);
    });

    it('updates when supplied with a valid item', async () => {
      const itemToUpdate = await seedItemToDatabase();
      const updateItem = buildItemObject();
      const response = await request(app)
        .post('/items/'+ itemToUpdate._id +'/update')
        .type('form')
        .send(updateItem);
      const updatedItem = await Item.findOne({ _id: itemToUpdate._id});
      assert.equal(updatedItem.title, updateItem.title);
      assert.equal(updatedItem.description, updateItem.description);
      assert.equal(updatedItem.imageUrl, updateItem.imageUrl);
    });

    it('displays an error message when supplied an empty title', async () => {
      const itemToUpdate = await seedItemToDatabase();
      const updateItem = buildItemObject();
      updateItem.title = undefined;
      const response = await request(app)
        .post('/items/'+ itemToUpdate._id +'/update')
        .type('form')
        .send(updateItem);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('displays an error message when supplied an empty description', async () => {
      const itemToUpdate = await seedItemToDatabase();
      const updateItem = buildItemObject();
      updateItem.description = undefined;
      const response = await request(app)
        .post('/items/'+ itemToUpdate._id +'/update')
        .type('form')
        .send(updateItem);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('displays an error message when supplied an empty imageUrl', async () => {
      const itemToUpdate = await seedItemToDatabase();
      const updateItem = buildItemObject();
      updateItem.imageUrl = undefined;
      const response = await request(app)
        .post('/items/'+ itemToUpdate._id +'/update')
        .type('form')
        .send(updateItem);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

  });
});
