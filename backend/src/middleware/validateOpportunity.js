// ==============================================================
// Validation Middleware for Research Opportunities
// ==============================================================
// Enforces strict data validation rules before controller execution:
// - All fields required on create
// - Strings non-empty after trimming
// - positions must be a positive integer
// - deadline must be a valid date in YYYY-MM-DD format
// - status must be only 'Open' or 'Closed'
// - :id must be a positive integer
// - On update, validates only provided fields, rejects empty body
// - Returns 400 with { error: 'Validation failed', details: [...] }
// ==============================================================

/**
 * Validates that a string is non-empty after trimming
 */
const isNonEmptyString = (val) => typeof val === 'string' && val.trim().length > 0;

/**
 * Validates that positions is a positive integer
 */
const isValidPositions = (val) => {
  if (val === undefined || val === null || val === '') return false;
  const num = Number(val);
  return Number.isInteger(num) && num > 0;
};

/**
 * Validates that deadline is a valid calendar date in YYYY-MM-DD format
 */
const isValidDate = (val) => {
  if (typeof val !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(val)) return false;

  const [yearStr, monthStr, dayStr] = val.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // Check month and day range
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  const dateObj = new Date(Date.UTC(year, month - 1, day));
  return (
    dateObj.getUTCFullYear() === year &&
    dateObj.getUTCMonth() === month - 1 &&
    dateObj.getUTCDate() === day
  );
};

/**
 * Validates status value
 */
const isValidStatus = (val) => val === 'Open' || val === 'Closed';

/**
 * Validates that :id route parameter is a positive integer
 */
const validateIdParam = (req, res, next) => {
  const { id } = req.params;
  const isPositiveInt = /^[1-9]\d*$/.test(id);

  if (!isPositiveInt) {
    return res.status(400).json({
      error: 'Validation failed',
      details: ['Opportunity ID must be a positive integer']
    });
  }

  next();
};

/**
 * Middleware: Validates payload for POST /api/opportunities
 */
const validateCreateOpportunity = (req, res, next) => {
  const details = [];
  const body = req.body || {};

  // Required fields validation
  if (!isNonEmptyString(body.title)) {
    details.push('title is required and cannot be empty');
  } else if (body.title.trim().length > 255) {
    details.push('title must not exceed 255 characters');
  }

  if (!isNonEmptyString(body.description)) {
    details.push('description is required and cannot be empty');
  }

  if (!isNonEmptyString(body.research_area)) {
    details.push('research_area is required and cannot be empty');
  } else if (body.research_area.trim().length > 150) {
    details.push('research_area must not exceed 150 characters');
  }

  if (!isNonEmptyString(body.faculty_name)) {
    details.push('faculty_name is required and cannot be empty');
  } else if (body.faculty_name.trim().length > 150) {
    details.push('faculty_name must not exceed 150 characters');
  }

  if (!isNonEmptyString(body.department)) {
    details.push('department is required and cannot be empty');
  } else if (body.department.trim().length > 150) {
    details.push('department must not exceed 150 characters');
  }

  if (!isNonEmptyString(body.required_skills)) {
    details.push('required_skills is required and cannot be empty');
  } else if (body.required_skills.trim().length > 500) {
    details.push('required_skills must not exceed 500 characters');
  }

  if (!isValidPositions(body.positions)) {
    details.push('positions is required and must be a positive integer greater than 0');
  }

  if (!isValidDate(body.deadline)) {
    details.push('deadline is required and must be a valid date in YYYY-MM-DD format');
  }

  if (body.status !== undefined && !isValidStatus(body.status)) {
    details.push("status must be either 'Open' or 'Closed'");
  }

  if (details.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details
    });
  }

  next();
};

/**
 * Middleware: Validates payload for PUT /api/opportunities/:id
 */
const validateUpdateOpportunity = (req, res, next) => {
  const body = req.body;

  // Reject empty body
  if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: ['Request body cannot be empty']
    });
  }

  const allowedFields = [
    'title',
    'description',
    'research_area',
    'faculty_name',
    'department',
    'required_skills',
    'positions',
    'deadline',
    'status'
  ];

  const providedFields = Object.keys(body).filter((key) => allowedFields.includes(key));
  if (providedFields.length === 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: ['At least one valid opportunity field must be provided for update']
    });
  }

  const details = [];

  if (body.title !== undefined) {
    if (!isNonEmptyString(body.title)) {
      details.push('title cannot be empty');
    } else if (body.title.trim().length > 255) {
      details.push('title must not exceed 255 characters');
    }
  }

  if (body.description !== undefined && !isNonEmptyString(body.description)) {
    details.push('description cannot be empty');
  }

  if (body.research_area !== undefined) {
    if (!isNonEmptyString(body.research_area)) {
      details.push('research_area cannot be empty');
    } else if (body.research_area.trim().length > 150) {
      details.push('research_area must not exceed 150 characters');
    }
  }

  if (body.faculty_name !== undefined) {
    if (!isNonEmptyString(body.faculty_name)) {
      details.push('faculty_name cannot be empty');
    } else if (body.faculty_name.trim().length > 150) {
      details.push('faculty_name must not exceed 150 characters');
    }
  }

  if (body.department !== undefined) {
    if (!isNonEmptyString(body.department)) {
      details.push('department cannot be empty');
    } else if (body.department.trim().length > 150) {
      details.push('department must not exceed 150 characters');
    }
  }

  if (body.required_skills !== undefined) {
    if (!isNonEmptyString(body.required_skills)) {
      details.push('required_skills cannot be empty');
    } else if (body.required_skills.trim().length > 500) {
      details.push('required_skills must not exceed 500 characters');
    }
  }

  if (body.positions !== undefined && !isValidPositions(body.positions)) {
    details.push('positions must be a positive integer greater than 0');
  }

  if (body.deadline !== undefined && !isValidDate(body.deadline)) {
    details.push('deadline must be a valid date in YYYY-MM-DD format');
  }

  if (body.status !== undefined && !isValidStatus(body.status)) {
    details.push("status must be either 'Open' or 'Closed'");
  }

  if (details.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details
    });
  }

  next();
};

module.exports = {
  validateIdParam,
  validateCreateOpportunity,
  validateUpdateOpportunity
};
