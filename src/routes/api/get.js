// src/routes/api/get.js
const { createSuccessResponse } = require('../../response');
/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // res.status(200).json({
  //   status: 'ok',
  //   fragments: [],
  // });
  // res.status(201).json(createSuccessResponse({ fragments: [] }));
   res.status(200).json(createSuccessResponse({ fragments: [] }));
};