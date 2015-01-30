
var Evernote = require("evernote")
;

function Arx (config) {
    for (var k in config) this[k] = config[k];
}

Arx.prototype.login = function () {
    if (!this.token) throw "No token!";
    var client = new Evernote.Client({ token: this.token })
    ,   noteStore = client.getNoteStore();

    noteStore.listNotebooks(function (notebooks) {
        for (var i in notebooks) {
            console.log("Notebook: " + notebooks[i].name);
        }
    });
};

module.exports = Arx;
