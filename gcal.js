const app = new (require('express'))();
const wt = require('webtask-tools');
const querystring = require('querystring');
const https = require('https');

app.get('/hours', function(req, res) {
    var output = res;
    var json = '';
    date = new Date().toISOString().split('T')[0];
    query = {
        'key': req.webtaskContext.data.gcal_key,
        'access_type': 'offline',
        'timeMax': date + 'T23:59:59Z',
        'timeMin': date + 'T08:00:00Z'
    };
    options = {
        host: 'www.googleapis.com',
        path: [
            '/calendar/v3/calendars/',
            req.webtaskContext.data.gcal_id,
            '@group.calendar.google.com/events?',
            querystring.stringify(query)
        ].join('')
    };
    https.get(options, function(res) {
        res.on('error', function(err) {
            output.writeHead(500, {'Content-Type': 'application/json'});
            output.end(JSON.stringify({
                statusCode: 500,
                message: "Internal server error.",
                error: err
            }));
        });
        res.on('data', function(data) {
            json += data.toString();
        });
        res.on('end', function() {
            output.writeHead(200, {'Content-Type': 'application/json'});
            output.end(JSON.stringify(json));
        });
    });
});

module.exports = wt.fromExpress(app);
