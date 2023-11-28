const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    await Fragment.delete(req.user, req.params.id);
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err));
  }
  return res.status(200).json(createSuccessResponse());
};