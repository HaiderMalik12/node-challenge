const path = require('path');
const funcs = require('./funcs');
const {encodeName} = funcs;


const session = {
  username:  process.argv[2],
  lastMessageHash: process.argv[3]
}

if (!session.username || !session.lastMessageHash) {
  console.log('Usage: node index.js <username> <hash>')
  process.exit(0)
}

// 1. load the database
let dbFile = path.join(__dirname, 'db', 'index.json')
funcs.loadDb(dbFile, function (err, db) {

  // 2. encode the name
  let encoded = encodeName(session.username);

  // 3. find the user's inbox
  let inbox = funcs.findInbox(db, encoded)

  // 4. find the next message
  funcs.findNextMessage(inbox, session.lastMessageHash,(err,output) =>{
    if(err) console.log(err);
    console.log('from',output.from);
    console.log('msg',output.msg);
  })

  // 5. print out the message.
  // Paste the console output into the "Solution" field and you're done!
});

