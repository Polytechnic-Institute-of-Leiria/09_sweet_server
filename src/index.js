require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000
app.use(express.json()) // for parsing application/json

if (process.env.USE_GPIO) {
  const { Gpio } = require( 'onoff' );
 
  const ledOut = new Gpio( '17', 'out' );
  let isLedOn = false;
   
  // run a infinite interval
  setInterval( () => {
   ledOut.writeSync( isLedOn ? 0 : 1 ); // provide 1 or 0
   isLedOn = !isLedOn; // toggle state
  }, 3000 ); // 3s  
}

const sensors = require('./sensors')

sensors.addSensor('roomTemp')
sensors.addSensor('kitchenTemp')

app.get('/', (req, res) => {
  res.send('Sweet Home!')
})

app.get('/sensors/:sensorName', function (req, res) {
  res.send(sensors.getSensor(req.params.sensorName))
})

app.patch('/sensors/:sensorName', function (req, res) {
  sensors.setValue(req.params.sensorName, req.body.value)
  res.json(req.body)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})