// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require("../../model/fragment");
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    var fragments = await Fragment.byUser(req.user, req.query.expand == 1);
    res.status(200).json(createSuccessResponse({
      fragments
    }));
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err));
  }

};