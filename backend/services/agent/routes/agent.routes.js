const express = require('express');
const router = express.Router();
const { handleRun } = require('../controllers/agent.controller');

router.post('/run', handleRun);

module.exports = router;
