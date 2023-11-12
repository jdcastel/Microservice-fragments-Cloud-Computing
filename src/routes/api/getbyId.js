const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
//Use node's path module
const path = require('path');

module.exports = async (req, res) => {
  try {
    const { user, params, originalUrl } = req;

    const id = path.basename(originalUrl);
    const extTypeName = path.extname(originalUrl);
    const baseUrl = path.basename(id, extTypeName);
    params.id = baseUrl;

    let fragment = await Fragment.byId(user, params.id);
    let data = await fragment.getData();

    if (extTypeName == '.html') {
      data = md.render(data.toString('utf-8'));
      data = Buffer.from(data, 'utf-8');
    }
    res.setHeader('Content-Type', fragment.type);
    res.setHeader('Content-Length', fragment.size);

    return res.status(200).send(data);
  } catch (err) {
    return res.status(404).json(createErrorResponse(404, err));
  }
};