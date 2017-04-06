const wt = require('webtask-tools');
const querystring = require('querystring');
const https = require('https');
var app = new (require('express'))();

/**
 * Response messages
 */

// const RESPONSE = {
//    ERROR : {
//      statusCode : 500,
//      message: "Something went wrong. Please try again."
//    },
//    TIMEOUT : {
//      statusCode : 504,
//      message : "Request to the Alma API endpoint timed out."
//    }
// };

app.get('/courses', function(req, res) {
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
    var alma_req = https.get(options, function(res) {
        console.log(res);
    });
    console.log(alma_req);
});

module.exports = wt.fromExpress(app);
