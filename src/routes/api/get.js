const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require("../../model/fragment");
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    // now returns expanded fragment metadata for an authenticated user. 
    let expand = (req.query.expand && req.query.expand == 1) ? true : false;
    var fragments = await Fragment.byUser(req.user, expand);

    res.status(200).json(createSuccessResponse({
      fragments
    }));
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err));
  }
};