'use strict';

var Crawler = require('../lib/crawler');
var expect = require('chai').expect;
var httpbinHost = 'localhost:8000';

describe('Errors', function() {
    describe('timeout', function() {
        var c = new Crawler({
            timeout : 1500,
            retryTimeout : 1000,
            retries : 2,
            jquery : false
        });
        it('should return a timeout error after ~5sec', function(done) {

            // override default mocha test timeout of 2000ms
            this.timeout(10000);

            c.queue({
                uri : 'http://'+httpbinHost+'/delay/15',
                callback : function(error, response) {
                    expect(error).not.to.be.null;
                    expect(response).to.be.undefined;
                    done();
                }
            });
        });
        it('should retry after a first timeout', function(done) {

            // override default mocha test timeout of 2000ms
            this.timeout(15000);

            c.queue({
                uri : 'http://'+httpbinHost+'/delay/1',
                callback : function(error, response) {
                    expect(error).to.be.null;
                    expect(response.body).to.be.ok;
                    done();
                }
            });
        });
    });

    describe('error status code', function() {
        var c = new Crawler({
            jQuery : false
        });
        it('should not return an error on a 404', function(done) {
            c.queue({
                uri : 'http://'+httpbinHost+'/status/404',
                callback : function(error, response) {
                    expect(error).to.be.null;
                    expect(response.statusCode).to.equal(404);
                    done();
                }
            });
        });
        it('should not return an error on a 500', function(done) {
            c.queue({
                uri : 'http://'+httpbinHost+'/status/500',
                callback : function(error, response) {
                    expect(error).to.be.null;
                    expect(response.statusCode).to.equal(500);
                    done();
                }
            });
        });
        it('should not failed on empty response', function(done) {
            c.queue({
                uri : 'http://'+httpbinHost+'/status/204',
                callback : function(error) {
                    expect(error).to.be.null;
                    done();
                }
            });
        });
        it('should not failed on a malformed html if jquery is false', function(done) {
            c.queue({
                html : '<html><p>hello <div>dude</p></html>',
                callback : function(error, response) {
                    expect(error).to.be.null;
                    expect(response).not.to.be.null;
                    done();
                }
            });
        });
        it('should return an error on a malformed html if jQuery is true', function(done) {
            c.queue({
                html : '<html><p>hello <div>dude</p></html>',
                jQuery : true,
                callback : function(error, response) {
                    expect(error).not.to.be.null;
                    expect(response).to.be.undefined;
                    done();
                }
            });
        });
        it('should return an error if can\'t read jquery', function(done) {
            c.queue({
                html : '<html><p>hello <div>dude</p></html>',
                jQuery : true,
                jQueryUrl : 'foobarsaucisson',
                callback : function(error, response) {
                    expect(error).not.to.be.null;
                    expect(response).to.be.undefined;
                    done();
                }
            });
        });
    });
});