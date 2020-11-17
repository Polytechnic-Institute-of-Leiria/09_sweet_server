const fs = require('fs');
const path = require('path');

const SENSORS_DIR = path.join('.','sensors')

const sensors = { };

var firebase = require("firebase/app")
require("firebase/database")

const firebaseConfig = {
  apiKey: "AIzaSyAKPpWe70S5zLqXpy3DtkIHff-b805nW-U",
  authDomain: "ipleiria-marcelino.firebaseapp.com",
  databaseURL: "https://ipleiria-marcelino.firebaseio.com",
  projectId: "ipleiria-marcelino",
  storageBucket: "ipleiria-marcelino.appspot.com",
  messagingSenderId: "410689969383",
  appId: "1:410689969383:web:93dccc17384ef20dcf9642"
};
firebase.initializeApp(firebaseConfig);


function readSensor(sensorName) {
  const filename = path.join(SENSORS_DIR, sensorName)
  fs.readFile(filename,  'utf8', (err, data) => {
    if (err) throw err;
    
    sensors[sensorName].value = Number(data)
    sensors[sensorName].dateTime = Date.now()
  });
}

function writeSensor(sensorName) {
  const filename = path.join(SENSORS_DIR, sensorName)
  fs.writeFileSync(filename, sensors[sensorName].value)

  firebase.database().ref('SweetHome/sensors/'+sensorName).set({
    value: sensors[sensorName].value,
    dateTime: sensors[sensorName].dateTime
  })
}

function getSensorFunction(sensorName) {
  return sensors[sensorName]
}

module.exports = {
  addSensor: function (sensorName) {
    sensors[sensorName] = {
      value: undefined,
      dateTime: Date.now()
    }

    const filename = path.join(SENSORS_DIR, sensorName)
    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, '0')
    }
    readSensor(sensorName)
    fs.watchFile(filename, (curr, prev) => {
      console.log(`the current mtime is: ${curr.mtime}`);
      console.log(`the previous mtime was: ${prev.mtime}`);
      readSensor(sensorName)
    });    
  },
  getSensor: getSensorFunction,
  setValue: function (sensorName, sensorValue) {
    let sensor = sensors[sensorName];
    if (sensor) {
      sensor.value = sensorValue,
      sensor.dateTime = Date.now()
      writeSensor(sensorName)
    }
  }
}
