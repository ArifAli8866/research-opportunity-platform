// ==============================================================
// Opportunity Routes
// ==============================================================
// Defines API endpoints for research opportunities.
// ==============================================================

const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');

// GET /api/opportunities -> Retrieve all opportunities
router.get('/', opportunityController.getAllOpportunities);

// GET /api/opportunities/:id -> Retrieve a single opportunity by ID
router.get('/:id', opportunityController.getOpportunityById);

// POST /api/opportunities -> Create a new opportunity
router.post('/', opportunityController.createOpportunity);

module.exports = router;
