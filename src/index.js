const express = require('express')
const app = express()
const port = 3000



const { Gpio } = require( 'onoff' );
 
const ledOut = new Gpio( '17', 'out' );
let isLedOn = false;
 
// run a infinite interval
setInterval( () => {
 ledOut.writeSync( isLedOn ? 0 : 1 ); // provide 1 or 0
 isLedOn = !isLedOn; // toggle state
}, 3000 ); // 3s






app.get('/', (req, res) => {
  res.send('Sweet Home!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})