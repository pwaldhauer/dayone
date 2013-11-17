var plist = require('plist');
var hat = require('hat');

function DayOneEntry() {
    this.creationDate = new Date();
    this.text = '';
    this.tags = [];
    this.timezone = 'Europe/Berlin';
    this.starred = false;
    this.music = {};
    this.activity = '';
    this.creator = {};
    this.location = {};
    this.weather = {};
}

DayOneEntry.prototype.toOutputFormat = function toOutputFormat() {
    if(!this.UUID) {
        this.UUID = hat().toUpperCase();
    }

    var entry = {
        "UUID": this.UUID,
        "Creation Date": this.creationDate,
        "Entry Text": this.text,
        "Tags": this.tags,
        "Time Zone": this.timezone,
        "Starred": this.starred,
        "Music": this.music,
        "Activity": this.activity,
        "Creator": this.creator,
        "Location": this.location,
        "Weather": this.weather
    };

    return plist.build(entry);
}

DayOneEntry.prototype.fromFile = function fromOutputFormat(filename) {
    var entry = plist.parseFileSync(filename);

    if(!entry) {
        return null;
    }

    this.UUID = entry['UUID'];
    this.creationDate = entry['Creation Date'];
    this.text = entry['Entry Text'];
    this.timezone = entry['Time Zone'];
    this.starred = entry['Starred'];

    if(entry['Tags']) {
        this.tags = entry['Tags'];
    }
    if (entry['Music']) {
        this.music = entry['Music'];
    }
    if (entry['Activity']) {
        this.activity = entry['Activity'];
    }
    if(entry['Location']) {
        this.location = entry['Location'];
    }
    if(entry['Tags']) {
        this.tags = entry['Tags'];
    }
    if(entry['Weather']) {
        this.weather = entry['Weather'];
    }
    return this;
}

exports.DayOneEntry = DayOneEntry;
