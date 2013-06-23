var assert = require('assert');
var fs = require('fs');
var path = require('path');
var plist = require('plist');

var DayOneEntry = require(__dirname + '/../lib/DayOneEntry').DayOneEntry;

describe('DayOneEntry', function() {

    describe('#toOutputFormat', function() {

        it('should convert an entry to the valid output format', function(done) {
            var entry = new DayOneEntry();

            entry.text = 'Text';
            entry.tags = ['Tag1', 'Tag2'];
            entry.starred = true;
            entry.creationDate = new Date(1371940000000);
            entry.timezone = 'Europe/Paris';

            var outPlist = entry.toOutputFormat();

            var parsed = plist.parseStringSync(outPlist);

            assert.equal(parsed['UUID'], entry.UUID);
            assert.equal(parsed['Entry Text'], entry.text);
            assert.deepEqual(parsed['Tags'], entry.tags);
            assert.equal(parsed['Starred'], entry.starred);
            assert.equal(parsed['Creation Date'].getTime(), entry.creationDate.getTime());
            assert.equal(parsed['Time Zone'], entry.timezone);

            done();
        });

    });

    describe('#fromFile', function() {

        it('should read the entry from the given file', function(done) {
            var file = path.join(__dirname, 'data', 'entries', '13D6062910C7D919AD0B5AA0FBC74667.doentry');

            var entry = new DayOneEntry();
            assert.notEqual(entry.fromFile(file), null, 'Loading should be successful');

            assert.equal(entry.text, 'TestText1');
            assert.equal(entry.UUID, '13D6062910C7D919AD0B5AA0FBC74667');
            assert.equal(entry.tags.length, 0);
            assert.equal(entry.timezone, 'Europe/Berlin');
            assert.equal(entry.starred, false);

            done();
        });


    });

});

