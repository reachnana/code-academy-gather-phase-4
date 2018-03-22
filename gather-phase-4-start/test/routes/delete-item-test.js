const {assert} = require('chai');
const request = require('supertest');
const Item = require('../../models/item');
const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

async function assertThrowsAsync(fn, regExp) {
  let f = () => {};
  try {
    await fn();
  } catch(e) {
    f = () => {throw e};
  } finally {
    assert.throws(f, regExp);
  }
}

describe('Server path: /items/:itemId/delete', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:
  describe('POST', () => {
    it('displays an error when supplied with an invalid item ID', async () => {
      const itemToDelete = await seedItemToDatabase();
      await assertThrowsAsync(async () => {
        await request(app)
        .post('/items/garbageid/delete')
        .type('form')
        .send(itemToDelete);
      }, Error);
    });

    it('deletes item when supplied with a valid item ID', async () => {
      const itemToDelete = await seedItemToDatabase();
      const response = await request(app)
        .post('/items/' + itemToDelete._id + '/delete')
        .type('form')
        .send({});
      const deletedItem = await Item.findOne({ _id: itemToDelete._id});
      assert.equal(deletedItem, null, 'Item was not deleted!');
    });


  });
});
