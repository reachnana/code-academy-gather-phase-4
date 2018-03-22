const router = require('express').Router();
const ObjectId = require('mongoose').Types.ObjectId;
const Item = require('../models/item');

router.get('/', async (req, res, next) => {
  const items = await Item.find({});
  res.render('index', {items});
});

router.get('/items/create', async (req, res, next) => {
  res.render('create');
});

router.post('/items/create', async (req, res, next) => {
  const {title, description, imageUrl} = req.body;
  const newItem = new Item({title, description, imageUrl});
  newItem.validateSync();
  if (newItem.errors) {
    res.status(400).render('create', {newItem: newItem});
  } else {
    await newItem.save();
    res.redirect('/');
  }

});

router.get('/items/:itemId', async (req, res, next) => {
  const itemId = req.params.itemId;

  if (ObjectId.isValid(itemId)) {
    const item = await Item.findOne({_id: itemId});
    if (item) {
      res.render('single', {item});
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }

});

router.post('/items/:itemId/delete', async (req, res, next) => {
  const itemId = req.params.itemId;

  if (ObjectId.isValid(itemId)) {
    await Item.findByIdAndRemove(itemId, function (err, data) {
      if (err) {
        throw new Error(err);
      }

      res.redirect('/');
    });
  } else {
    throw new Error(err);
  }

});

router.get('/items/:itemId/update', async (req, res, next) => {
  const itemId = req.params.itemId;

  if (ObjectId.isValid(itemId)) {
    const item = await Item.findOne({_id: itemId});
    if(item) {
      res.render('update', {item});
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }

});

router.post('/items/:itemId/update', async (req, res, next) => {
  const { title, description, imageUrl } = req.body;
  const updateItem = await Item.findById(req.params.itemId);
  updateItem.set('title', title);
  updateItem.set('description', description);
  updateItem.set('imageUrl', imageUrl);
  updateItem.validateSync();
  if (updateItem.errors) {
    res.status(400).render('update', { item: updateItem });
  } else {
    await updateItem.save();
    res.redirect('/items/' + updateItem._id);
  }
});

module.exports = router;
