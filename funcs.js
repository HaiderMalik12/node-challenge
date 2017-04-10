var fs = require('fs')
var path = require('path')

/**
 * General purpose data encoding
 *
 * (string): string
 */
function encode(data) {
  return (new Buffer(data)).toString('base64')
}

/**
 * Inverse of `encode`
 *
 * (string): string
 */
function decode(data) {
  return (new Buffer('' + data, 'base64')).toString()
}

/**
 * Encode a superhero name
 *
 * (string): string
*/
encodeName = function (name) {
  return encode('@' + name)
}

/**
 * Load the database
 *
 * (string, (?Error, ?Object))
 */
loadDb = function (dbFile, cb) {
  fs.readFile(dbFile, function (err, res) {
    if (err) { return cb(err) }

    var messages
    try {
      messages = JSON.parse(res)
    } catch (e) {
      return cb(err)
    }

    return cb(null, { file: dbFile, messages: messages })
  })
}

/**
 * Find the user's inbox, given their encoded username
 *
 * (Object, string): Object
 */
findInbox = function (db, encodedName) {
  var messages = db.messages
  return {
    dir: path.dirname(db.file),
    messages: Object.keys(messages).reduce(function (acc, key) {
      if (messages[key].to === encodedName) {
        let _acc =acc.concat({
          hash: key,
          lastHash: messages[key].last,
          from: messages[key].from
        })
          return _acc;
      } else { return acc }
    }, [])
  }
}

/**
 * Find the next message, given the hash of the previous message
 *
 * ({ messages: Array<Object> }, string): string
 */
findNextMessage = function (inbox, lastHash,cb) {
  // find the message which comes after lastHash
  var found
  for (var i = 0; i < inbox.messages.length; i += 1) {
    if (inbox.messages[i].lastHash === lastHash) {
      found = i;
      break;
    }
  }
    
    fs.readFile(path.join(inbox.dir, inbox.messages[found].hash), 'utf8',(err,data) => {
        if(err) {
          cb(err);
      }
        let from = 'from: ' + decode(inbox.messages[found].from) + '\n---\n';
        let msg = decode(data);
        cb(null,{from,msg});
        
    })
}


//expose these methods 
module.exports = {
  findNextMessage,
  findInbox,
  loadDb,
  encodeName
};
