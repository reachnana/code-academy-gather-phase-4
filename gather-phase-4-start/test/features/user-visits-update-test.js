const {assert} = require('chai');
const {buildItemObject, seedItemToDatabase} = require('../test-utils');

describe('User visits the update page', () => {
  describe('gets an item', () => {
    it('and is rendered', async () => {
      const updateItem = await seedItemToDatabase();
      await browser.url('/items/' + updateItem._id + '/update');
      assert.equal(await browser.getValue('#title-input'), updateItem.title);
      assert.equal(await browser.getValue('#description-input'), updateItem.description);
      assert.equal(await browser.getValue('#imageUrl-input'), updateItem.imageUrl);
    });

    it('and submits an update', async () => {
      const itemToUpdate = buildItemObject();
      const updateItem = await seedItemToDatabase();
      await browser.url('/items/' + updateItem._id + '/update');
      await browser.setValue('#title-input', itemToUpdate.title);
      await browser.setValue('#description-input', itemToUpdate.description);
      await browser.setValue('#imageUrl-input', itemToUpdate.imageUrl);
      await browser.click('#submit-button');
      assert.include(await browser.getText('body'), itemToUpdate.title);
      assert.include(await browser.getText('body'), itemToUpdate.description);
      assert.include(await browser.getAttribute('body img', 'src'), itemToUpdate.imageUrl);
    });
  });
});
