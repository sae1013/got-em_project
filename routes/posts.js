const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/async-handler');
const {Product} = require('../models/index');
const adminRequired = require('../middlewares/admin-required');



module.exports = router;



