var path = require('path-extra');
var moment = require('moment');
var fs = require('fs');

var DayOneEntry = require(__dirname + '/DayOneEntry').DayOneEntry;

// Append this to the users home directory.
var defaultDirectory = 'Library/Mobile Documents/5U8NS4GX82~com~dayoneapp~dayone/Documents/Journal_dayone/';
var dropboxDirectory = 'Dropbox/Applications/Day One/Journal.dayone/';

function DayOne(options) {
    if(!options) {
        options = {};
    }

    // Try to find the Day One directory
    if(!options.hasOwnProperty('directory')) {
        var directory = path.join(path.homedir(), defaultDirectory);
        if(!fs.existsSync(directory)) {
	    directory = path.join(path.homedir(), dropboxDirectory);
	    if(!fs.existsSync(directory)) {
		return Error('Day One journal directory auto detection failed. Both iCloud and Dropbox directory don\'t exist.');
	    }
        }

        options.directory = directory;
    }

    this.options = options;
}

DayOne.prototype.list = function list(options, cb) {
    if(!cb && Object.prototype.toString.call(options) == '[object Function]') {
        cb = options;
        options = {};
    }

    var that = this;
    var fullpath = path.join(this.options.directory, 'entries');

    var entries = [];

    fs.readdirSync(fullpath).forEach(function(file) {
        var entry = new DayOneEntry();
        if(!entry.fromFile(path.join(fullpath, file))) {
            return;
        }

        // If no tag filter was set just use the entry
        if(!options.hasOwnProperty('tag')) {
            entries.push(entry);
            return;
        }

        // Filter by tag
        if(entry.tags.indexOf(options.tag) != -1) {
            entries.push(entry);
        }
    });

    cb(null, entries);
}

DayOne.prototype.remove = function remove(uuid, cb) {
    var that = this;

    var fullpathEntry = path.join(this.options.directory, 'entries', uuid + '.doentry');
    var fullpathPhoto = path.join(this.options.directory, 'photos', uuid + '.jpg');

    if(fs.existsSync(fullpathEntry)) {
        fs.unlinkSync(fullpathEntry);
    }

    if(fs.existsSync(fullpathPhoto)) {
        fs.unlinkSync(fullpathPhoto);
    }

    cb(null);
}

DayOne.prototype.save = function save(entry, cb) {
    var that = this;

    var fullpathEntry = path.join(this.options.directory, 'entries');
    var fullpathPhoto = path.join(this.options.directory, 'photos');

    var plistEntry = entry.toOutputFormat();

    fs.writeFile(path.join(fullpathEntry, entry.UUID + '.doentry'), plistEntry.toString(), function(err) {
        if(err) {
            cb(err);
            return;
        }

        if(entry.photo) {
            fs.writeFile(path.join(fullpathPhoto, entry.UUID + '.jpg'), entry.photo, function(err) {
                if(err) {
                    cb(err);
                    return;
                }

                cb(null)
            });

            return;
        }

        cb(null);
    });
}

exports.DayOne = DayOne;
