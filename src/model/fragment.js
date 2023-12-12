//Assignment1
// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
var md = require('markdown-it')({
  html: true,
});
// var md1 = require('markdown-it')();
const sharp = require('sharp');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ ownerId, created, updated, type, size = 0, id }) {
    if (!ownerId || !type || !Fragment.isSupportedType(type)) {
      throw new Error('Invalid or unsupported type.');
    }
    if (typeof size !== 'number' || size < 0) {
      throw new Error('Size must be a non-negative number.');
    }

    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand=false) {
    // A user might not have any fragments (yet), so return an empty
    // list instead of an error when there aren't any.
    try {
      const fragments = await listFragments(ownerId, expand);
      return expand ? fragments.map((fragment) => new Fragment(fragment)) : fragments;
    } catch (err) {
      return [];
    }
  }


  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    if ((await readFragment(ownerId, id)) == undefined) throw new Error('No fragment found');
    return await readFragment(ownerId, id);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  async save() {
    this.updated = new Date().toISOString();
    return await writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    return await readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    try {
      if (!data) {
        throw 'no data in setData function';
      }
      this.size = Buffer.from(data).length;
      this.updated = new Date().toISOString();
      return await writeFragmentData(this.ownerId, this.id, data);
    } catch (error) {
      return Promise.reject(new Error('Error in setData function', error));
    }
  }

  async setDataType(type) {
    try {
      if (!type) {
        throw 'no data in setData function';
      }
      this.type = type;
      this.updated = new Date().toISOString();
      return await writeFragment(this);
    } catch (error) {
      return Promise.reject(new Error('Error in setData function', error));
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const textExt = [`text/plain`, `text/markdown`, `text/html`];
    return textExt.includes(this.mimeType);
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return [this.mimeType];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const validTypes = new Set([
      'text/plain',
      'text/markdown',
      'text/html',
      'application/json',
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
    ]);

    if (!value || value.trim().length === 0) {
      return false;
    }

    const delimiterIndex = value.indexOf(';');
    const type = delimiterIndex === -1 ? value : value.substring(0, delimiterIndex);

    return validTypes.has(type);
  }

  async fragmentConversion(buffer, conversionext, fragment) {
    let fragmentData = null;
    console.log('object1',conversionext);
    if (fragment.type === 'text/plain' && conversionext === 'txt') {
      return buffer.toString();
    }

    if (fragment.type === 'text/markdown' && ['md', 'html', 'txt'].includes(conversionext)) {
      if (conversionext === 'txt') {
        fragmentData = buffer;
        fragmentData = md.render(fragmentData.toString('utf-8'));
        fragmentData = Buffer.from(fragmentData, 'utf-8');
        fragment.setDataType('text/plain');
        await writeFragmentData(this.ownerId, this.id, buffer);
        return fragmentData;
      }

      if (conversionext === 'html') {
        fragmentData = buffer;
        fragmentData = md.render(fragmentData.toString('utf-8'));
        fragmentData = Buffer.from(fragmentData, 'utf-8');
        fragment.setDataType('text/html');
        await writeFragmentData(this.ownerId, this.id, buffer);
        return fragmentData;
      }
      return buffer;
    }

    if (fragment.type === 'text/html' && ['html', 'txt'].includes(conversionext)) {
      if (conversionext === 'txt') {
        fragmentData = buffer;
        fragmentData = md.render(fragmentData.toString('utf-8'));
        fragmentData = Buffer.from(fragmentData, 'utf-8');
        fragment.setDataType('text/plain');
        await writeFragmentData(this.ownerId, this.id, buffer);
        return fragmentData;
      }
      return buffer;
    }

    if (fragment.type === 'application/json' && ['json', 'txt'].includes(conversionext)) {
      if (conversionext === 'txt') {
        fragmentData = buffer;
        fragmentData = JSON.parse(fragmentData.toString('utf-8'));
        fragmentData = Buffer.from(JSON.stringify(fragmentData), 'utf-8');
        fragment.setDataType('text/plain');
        await writeFragmentData(this.ownerId, this.id, buffer);
      }
      return buffer;
    }
console.log('object2',conversionext);
    if (fragment.type.includes('image/') && ['png', 'jpeg', 'webp', 'gif'].includes(conversionext)) {
      if(conversionext === 'png') {
        fragment.setDataType('image/png');
      }else if(conversionext === 'jpg') {
        fragment.setDataType('image/jpeg');
      }else if(conversionext === 'webp') {
        fragment.setDataType('image/webp');
      }else if(conversionext === 'gif'){
        fragment.setDataType('image/gif');
      }
      
      fragmentData = await sharp(buffer).toFormat(conversionext).toBuffer();

      await writeFragmentData(this.ownerId, this.id, buffer);

      return fragmentData;
    }
    return fragmentData;
  }
}

module.exports.Fragment = Fragment;
