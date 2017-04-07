var app = new (require('express'))();
var parser = new (require('xml2js')).Parser();
var wt = require('webtask-tools');
var querystring = require('querystring');
var https = require('https');

app.get('/courses', function(req, res) {
    var output = res;
    var xml = '';
    var query = querystring.stringify({
        'limit': req.webtaskContext.query.limit || 100,
        'offset': req.webtaskContext.query.offset || 0,
        'apikey': req.webtaskContext.data.alma_key,
        'q': 'searchableid~res',
        'order_by': 'code,section',
        'direction': 'ASC'
    });
    var options = {
        host: req.webtaskContext.data.alma_url,
        path: '/almaws/v1/courses?' + query
    };
    parser.on('error', function(err) {
        output.writeHead(500, {'Content-Type': 'application/json'});
        output.end(JSON.stringify({
            statusCode: 500,
            message: "XML parser error. ",
            error: err
        }));
    });
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
            xml += data.toString();
        });
        res.on('end', function() {
            parser.parseString(xml, function(err, json) {
                output.writeHead(200, {'Content-Type': 'application/json'});
                output.end(JSON.stringify(json));
            });
        });
    });
});

module.exports = wt.fromExpress(app);
