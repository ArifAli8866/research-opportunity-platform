// ==============================================================
// Opportunity Routes
// ==============================================================
// Defines API endpoints for research opportunities.
// ==============================================================

const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const {
  validateIdParam,
  validateCreateOpportunity,
  validateUpdateOpportunity
} = require('../middleware/validateOpportunity');

// GET /api/opportunities -> Retrieve all opportunities
router.get('/', opportunityController.getAllOpportunities);

// GET /api/opportunities/:id -> Retrieve a single opportunity by ID
router.get('/:id', validateIdParam, opportunityController.getOpportunityById);

// POST /api/opportunities -> Create a new opportunity
router.post('/', validateCreateOpportunity, opportunityController.createOpportunity);

// PUT /api/opportunities/:id -> Update an existing opportunity
router.put('/:id', validateIdParam, validateUpdateOpportunity, opportunityController.updateOpportunity);

// DELETE /api/opportunities/:id -> Delete an opportunity
router.delete('/:id', validateIdParam, opportunityController.deleteOpportunity);

module.exports = router;
