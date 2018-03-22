const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User posts a new item', () => {
  describe('clicks on the created item', () => {
    it('and renders the created item\'s description', () => {
      // setup
      const itemToCreate = buildItemObject();
      // exercise
      browser.url('/items/create');
      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#description-input', itemToCreate.description);
      browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
      browser.click('#submit-button');
      browser.click('.item-card a');
      // verification
      assert.include(browser.getText('#item-description'), itemToCreate.description);
    });
  });
});
