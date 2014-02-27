var assert = require('assert');
var fs = require('fs');
var path = require('path');

var DayOne = require(__dirname + '/../lib/DayOne').DayOne;
var DayOneEntry = require(__dirname + '/../lib/DayOneEntry').DayOneEntry;

var mockConfig = {
    directory: __dirname + '/data/'
};

describe('DayOne', function() {

    describe('#list', function() {

        it('should list all available entries', function(done) {
            var day1 = new DayOne(mockConfig);

            day1.list(function(error, entries) {
                assert.equal(entries.length, 3, 'Three entries');

                done();
            });
        });

        it('should list all entries matching the tags', function(done) {
            var day1 = new DayOne(mockConfig);

            day1.list({
                tags: ['test']
            }, function(error, entries) {
                assert.equal(entries.length, 1, 'One entry');
                assert.equal(entries[0].tags.indexOf('test'), 0, 'Needs to include tag test');
                assert.equal(entries[0].text, 'TaggedEntry', 'Only the tagged entry');

                done();
            });
        });

        it('should list all entries matching the starred option', function(done) {
            var day1 = new DayOne(mockConfig);

            day1.list({
              starred: false
            }, function(error, entries) {
                assert.equal(entries.length, 2, 'Two entries');
                assert.equal(entries[0].starred, false, 'Matches the starred option');

                done();
            });
        });

        it('should list all entries matching the starred option and the tags', function(done) {
            var day1 = new DayOne(mockConfig);

            day1.list({
              starred: true,
              tags: ['othertag']
            }, function(error, entries) {
                assert.equal(entries.length, 1, 'One entry');
                assert.equal(entries[0].tags.indexOf('othertag'), 0, 'Needs to include tag othertag');
                assert.equal(entries[0].starred, true, 'Matches the starred option');
                assert.equal(entries[0].text, true, 'Tagged and starred entry');

                done();
            });
        });
    });

    describe('#save', function() {

        it('should save the entry', function(done) {
            var day1 = new DayOne(mockConfig);

            var entry = new DayOneEntry();
            entry.text = 'SuperTestText';
            entry.tags = ['Tag1', 'Tag2'];
            entry.UUID = 'test_uuid';

            day1.save(entry, function(error) {
                assert.equal(error, null, 'Error should be null');

                var file = path.join(mockConfig.directory, 'entries', entry.UUID + '.doentry');

                // Check that the file exists at the expected path
                assert.equal(fs.existsSync(file), true, 'File should exist');

                var written = new DayOneEntry();
                assert.notEqual(written.fromFile(file), null, 'Reading should not result in null');
                assert.equal(entry.text, written.text, 'Text should be equal');
                assert.deepEqual(entry.tags, written.tags, 'Tags should be equal');
                assert.equal(entry.UUID, written.UUID, 'UUID should be equal');

                // Cleanup
                fs.unlinkSync(file);

                done();
            });
        });

        it('should save the entry with an attached photo', function(done) {
            var day1 = new DayOne(mockConfig);

            var entry = new DayOneEntry();
            entry.text = 'SuperTestText2';
            entry.tags = ['Tag4', 'Tag3'];
            entry.UUID = 'test2_uuid';
            entry.photo = new Buffer(fs.readFileSync(path.join(__dirname, 'data', 'test.jpg')));

            day1.save(entry, function(error) {
                assert.equal(error, null, 'Error should be null');

                var file = path.join(mockConfig.directory, 'entries', entry.UUID + '.doentry');
                var photo = path.join(mockConfig.directory, 'photos', entry.UUID + '.jpg');

                // Check that the files exists at the expected path
                assert.equal(fs.existsSync(file), true, 'File should exist');
                assert.equal(fs.existsSync(photo), true, 'Photo should exist');

                // Cleanup
                fs.unlinkSync(file);
                fs.unlinkSync(photo);

                done();
            });
        });

    });

    describe('#remove', function() {

        it('should remove the given entry', function(done) {
            var day1 = new DayOne(mockConfig);

            // Create test entry
            var entry = new DayOneEntry();
            entry.text = 'SuperTestText2';
            entry.tags = ['Tag4', 'Tag3'];
            entry.UUID = 'test2_uuid';
            entry.photo = new Buffer(fs.readFileSync(path.join(__dirname, 'data', 'test.jpg')));

            day1.save(entry, function(error) {
                assert.equal(error, null, 'Error should be null');
                day1.remove(entry.UUID, function(error) {
                    assert.equal(error, null, 'Error should be null');
                    done();
                })
            });
        });

    });

});


