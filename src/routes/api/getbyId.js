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
    let fragmentData = await fragment.getData();
    if (extTypeName == "") {
      res.setHeader('Content-Type', fragment.type);
      res.setHeader('Content-Length', fragment.size);
      
      return res.status(200).send(fragmentData);
    } 
    if(fragment.type === "text/markdown" && extTypeName === ".html") {
      
        fragmentData = md.render(fragmentData.toString('utf-8'));
        fragmentData = Buffer.from(fragmentData, 'utf-8');

        res.setHeader('Content-Type', fragment.type);
        res.setHeader('Content-Length', fragment.size);
  
        return res.status(200).send(fragmentData);
      }else{
        res.status(415).json(createErrorResponse(
          //a plain text fragment cannot be returned as a PNG
          415, "a " + fragment.type + " fragment cannot be returned as a " + extTypeName
        ));
      }

  } catch (err) {
    return res.status(404).json(createErrorResponse(404, err));
  }
};