#!/usr/bin/env node

var Arx = require("../lib/arxote")
,   config = require("../config.json") // XXX this would need more flexibility
,   client = new Arx(config)
;

client.login(config);
console.log("Heyo!");