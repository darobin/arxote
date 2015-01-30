
var Evernote = require("evernote").Evernote
,   crypto = require("crypto")
,   fs = require("fs")
,   sua = require("superagent")
,   whacko = require("whacko")
;

function Arx (config) {
    for (var k in config) this[k] = config[k];
}

Arx.prototype.login = function (cb) {
    if (!this.token) return cb(new Error("No token!"));
    console.log("token:", this.token);
    var client = new Evernote.Client({ token: this.token });
    this.noteStore = client.getNoteStore(this.notesStoreURL);

    // https://www.evernote.com/shard/s5/notestore
    this.noteStore.listNotebooks(function (err, notebooks) {
        if (err) return cb(err);
        for (var i in notebooks) {
            if (notebooks[i].name === "to read") {
                this.notebookGuid = notebooks[i].guid;
                break;
            }
        }
        cb();
    });
};

Arx.prototype.createNote = function (title, pdf, cb) {
    var note = new Evernote.Note();
    note.title = title;
    note.notebookGuid = this.notebookGuid;
    var pdf = fs.readFileSync(pdf)
    ,   hash = pdf.toString("base64")
    ,   data = new Evernote.Data();
    data.size = pdf.length;
    data.bodyHash = hash;
    data.body = pdf;
    var resource = new Evernote.Resource();
    resource.mime = "application/pdf";
    resource.data = data;
    note.resources = [resource];
    var md5 = crypto.createHash("md5");
    md5.update(pdf);
    var hashHex = md5.digest("hex");

    note.content = '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">' +
                   '<en-note><en-media type="application/pdf" hash="' + hashHex + '"/></en-note>';
    this.noteStore.createNote(note, cb); // receives err, createdNote
};

Arx.prototype.load = function (url, cb) {
    sua.get(url)
        .buffer(true)
        .end(function (err, res) {
            if (err) return cb(err);
            if (res.error) return cb(new Error(res.status));
            cb(null, whacko.load(res.text));
        });
};

Arx.prototype.extract = function ($, cb) {
    var data = {}
    ,   url = "http://arxiv.org" + $("a[accesskey='f']").attr("href")
    ;
    data.title = $("h1.title").text();
    sua.get(url)
        // .buffer(true)
        .pipe() // XXX make a passthrough stream to debug
        .end(function (err, res) {
            // if (err) return cb(err);
            // if (res.error) return cb(new Error(res.status));
            // data.pdf = res.text;
            // cb(null, data);
        });
};

module.exports = Arx;
