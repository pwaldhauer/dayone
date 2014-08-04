var DayOne = require('./lib/DayOne').DayOne;
var DOE = require('./lib/DayOneEntry').DayOneEntry;

var done = new DayOne();

done.list(function(err, entries) {
    console.log(entries);
})

var entry = new DOE();
entry.text = 'LOL';

done.save(entry, function() {
    console.log('saved');
});
