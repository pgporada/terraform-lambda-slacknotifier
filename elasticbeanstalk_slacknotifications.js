var http = require('https');

// Create Slack channel -> Slack URL mapping
// This incoming webhook URL is provided when adding a Slack integration
var config = {
    '####SLACK_CHANNEL_NAME####': '####FILL_THIS_IN_WITH_YOUR_SLACK_WEBHOOK#####',
};

/*
  Convenience method to fetch the channel's URL
*/
get_channel_endpoint = function(chan) {
    return config[chan];
};

/*
  Parse the SNS payload. This function assumes only one message
  notification is sent as part of the payload. The payload is
  broken up into key:value pairs and returned as an object.
*/
parse = function(payload) {
    parts = payload.Records[0].Sns.Message.split('\n');
    data = {};
    parts.forEach(function(part) {
        if(part.length < 1) {
            return;
        }
        key = part.split(':', 1)[0];
        value = part.split(key+': ').reverse()[0];
        data[key] = value;
    });
    return data;
};

/*
  Convenience method for creating the payload to send to Slack
*/
buildSlackPayload = function(postData, endPoint) {
    return {
        'postData': JSON.stringify(postData), 
        'options': endPoint
    };
};

/*
  Adds extra "attachment" data to display a customized message in Slack
  instead of a simple message. We're excluding 'Message' here beacuse
  we're using message as the main content of the Slack notification.
*/
makeSlackAttachmentFields = function(d) {
    var excludeKeys = ['RequestId', 'NotificationProcessId', 'Message'];
    var arr = [];
    Object.keys(d).forEach(function(k){
       if(excludeKeys.indexOf(k) != -1) {
           return;
       }
       arr.push({"title": k, "value": d[k], "short":false});
    });
    return arr;
};

/*
  Main Lambda handler
*/
exports.handler = function(event, context) {
    // Slack channel to notify
    var channel = "####SLACK_CHANNEL_NAME####";
    
    // Parse event data from SNS
    data = parse(event);
    
    // Create Slack attachment data
    dataFields = makeSlackAttachmentFields(data);
    
    postData = {
        // Set the Slack channel within the payload
        "channel": channel,
        
        // Name of the Slack "bot" (this can be anything, doesn't
        // have to be an existing user)
        "username": "ElasticBeanBot",
        "attachments": [
            {
                "fallback": data.Message,
                "text": data.Message,
                "fields": dataFields
            }    
        ]
    };
    dOpt = buildSlackPayload(postData, get_channel_endpoint(channel));
    
    // Create HTTP request
    var req = http.request(dOpt.options, function(res){
        res.setEncoding("utf8");
        res.on('data', function(d) {
            console.log(d);
            // Wait for a response before calling succeed, otherwise
            // our Lambda function will exit too early
            context.succeed();
        });
    });
    req.on('error', function(err){
        console.log(err.message);
        // If we get an error, stop execution.
        context.fail(err.message);

    });
    
    // Set request headers
    req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.setHeader('Content-Length', dOpt.postData.length);
    
    // Write the actual POST data
    req.write(dOpt.postData);
    
    // Indicate no additional data will be written
    req.end();
};
