// ==============================================================
// Opportunity Controller
// ==============================================================
// Handles HTTP requests and business logic for research opportunities.
// All database queries use parameterized SQL statements to prevent
// SQL injection vulnerabilities.
// ==============================================================

const db = require('../config/db');

/**
 * Create a new research opportunity
 * POST /api/opportunities
 * Returns 201 with the newly created opportunity record
 */
const createOpportunity = async (req, res, next) => {
  try {
    const {
      title,
      description,
      research_area,
      faculty_name,
      department,
      required_skills,
      positions,
      deadline,
      status = 'Open'
    } = req.body;

    // Parameterized query prevents SQL injection
    const insertSql = `
      INSERT INTO opportunities (
        title,
        description,
        research_area,
        faculty_name,
        department,
        required_skills,
        positions,
        deadline,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      title.trim(),
      description.trim(),
      research_area.trim(),
      faculty_name.trim(),
      department.trim(),
      required_skills.trim(),
      parseInt(positions, 10),
      deadline.trim(),
      status ? status.trim() : 'Open'
    ];

    const [result] = await db.query(insertSql, values);

    // Fetch the newly inserted record so client receives the complete object including id and timestamps
    const [rows] = await db.query('SELECT * FROM opportunities WHERE id = ?', [result.insertId]);

    return res.status(201).json(rows[0]);
  } catch (error) {
    // Pass unexpected errors to global error handler
    next(error);
  }
};

/**
 * Retrieve all research opportunities
 * GET /api/opportunities
 * Returns 200 with an array of opportunities
 */
const getAllOpportunities = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM opportunities ORDER BY created_at DESC'
    );
    return res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve a single research opportunity by ID
 * GET /api/opportunities/:id
 * Returns 200 with the opportunity record, or 404 if not found
 */
const getOpportunityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM opportunities WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing research opportunity
 * PUT /api/opportunities/:id
 * Returns 200 with the updated opportunity record, or 404 if not found
 */
const updateOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    // First check if the record exists
    const [existing] = await db.query('SELECT * FROM opportunities WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
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

    const updates = [];
    const values = [];

    // Dynamically build SET clauses based on supplied fields
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        if (field === 'positions') {
          values.push(parseInt(req.body[field], 10));
        } else if (typeof req.body[field] === 'string') {
          values.push(req.body[field].trim());
        } else {
          values.push(req.body[field]);
        }
      }
    }

    // Append ID for the WHERE clause
    values.push(id);

    const updateSql = `UPDATE opportunities SET ${updates.join(', ')} WHERE id = ?`;
    await db.query(updateSql, values);

    // Fetch and return the updated record
    const [updatedRows] = await db.query('SELECT * FROM opportunities WHERE id = ?', [id]);
    return res.status(200).json(updatedRows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a research opportunity by ID
 * DELETE /api/opportunities/:id
 * Returns 200 with a success message, or 404 if not found
 */
const deleteOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    // First check if the record exists
    const [existing] = await db.query('SELECT id FROM opportunities WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    // Delete the opportunity using a parameterized query
    await db.query('DELETE FROM opportunities WHERE id = ?', [id]);

    return res.status(200).json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
};
