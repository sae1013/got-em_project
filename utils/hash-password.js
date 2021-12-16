const crypto = require('crypto');

module.exports = (password) => { // hash vs bycript 비교하여 좋은걸로선택
  const hash = crypto.createHash('sha1');
  hash.update(password);
  return hash.digest("hex");
}