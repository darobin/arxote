#!/usr/bin/env node

var Arx = require("../lib/arxote")
,   config = require("../config.json") // XXX this would need more flexibility
,   client = new Arx(config)
;

// client.login();

client.load("http://arxiv.org/abs/1501.04115", function (err, $) {
    if (err) throw err;
    client.extract($, function (err, data) {
        if (err) throw err;
        console.log(data);
    });
});
