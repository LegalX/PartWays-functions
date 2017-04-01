'use strict';

const functions = require('firebase-functions');
const rp = require('request-promise');
const crypto = require('crypto');

// Sends user feedback to Slack channel.
exports.feedbackToSlack = functions.database.ref('/feedback/{feedbackId}').onWrite(event => {
    const snapshot = event.data;
    const feedback = snapshot.val();

    const text = `*${feedback.userName}* (User ID: ${feedback.userId}, Application ID: ${feedback.applicationId}) 
submitted ${feedback.hasOwnProperty('isPositive') ? (feedback.isPositive ? '*positive*' : '*negative*') : 'new'} feedback: 
>${feedback.text}
and *${feedback.isEmailAllowed ? 'gave' : 'denied'} permission* to send reply to ${feedback.email}`;

    return rp({
        method: 'POST',
        // TODO: Configure the `slack.webhook_url` Google Cloud environment variables.
        uri: 'https://hooks.slack.com/services/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', // functions.config().slack.webhook_url,
        body: {
            text: text
        },
        json: true
    });

});
