// ==============================================================
// Opportunity Routes
// ==============================================================
// Defines API endpoints for research opportunities.
// ==============================================================

const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');

// POST /api/opportunities -> Create a new opportunity
router.post('/', opportunityController.createOpportunity);

module.exports = router;
