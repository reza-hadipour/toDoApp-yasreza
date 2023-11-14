const express = require('express');
const router = express.Router({caseSensitive:false});
const controller = require('./controller/itemController');

router.get('/',controller.getData);

router.post('/',controller.insertData);

router.patch('/',controller.updateItem);

router.delete('/:id',controller.deleteItem)

module.exports = router;