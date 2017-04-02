'use strict';

const functions = require('firebase-functions');

// Sends user feedback to Slack channel.
const rp = require('request-promise');
exports.feedbackToSlack = functions.database.ref('/feedback/{feedbackId}').onWrite(event => {
    const snapshot = event.data;
    const feedback = snapshot.val();

    const message = `*${feedback.userName}* (User ID: ${feedback.userId}, Application ID: ${feedback.applicationId}) 
submitted ${feedback.hasOwnProperty('isPositive') ? (feedback.isPositive ? '*positive*' : '*negative*') : 'new'} feedback: 
>${feedback.text}
and *${feedback.isEmailAllowed ? 'gave' : 'denied'} permission* to send reply to ${feedback.email}`;
    return rp({
        method: 'POST',
        uri: functions.config().slack.webhook_url,
        body: {
            text: message
        },
        json: true
    });
});


// Sends an email confirmation when a user changes his mailing list subscription.
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
const mailTransport = nodemailer.createTransport(`smtps://${encodeURIComponent(functions.config().gmail.email)}:${encodeURIComponent(functions.config().gmail.password)}@smtp.gmail.com`);
exports.sendEmailConfirmation = functions.database.ref('/users/{uid}').onWrite(event => {
    const snapshot = event.data;
    const val = snapshot.val();

    if (!snapshot.changed('subscribedToMailingList')) {
        return;
    }

    const mailOptions = {
        from: '"PartWays" <noreply@partways.com>',
        to: val.email
    };

    // The user just subscribed to our newsletter.
    if (val.subscribedToMailingList) {
        mailOptions.subject = 'Thanks and Welcome!';
        mailOptions.text = 'Thanks you for subscribing to our newsletter. You will receive our next weekly newsletter.';
        return mailTransport.sendMail(mailOptions).then(() => {
            console.log('New subscription confirmation email sent to:', val.email);
        });
    }

    // The user unsubscribed to the newsletter.
    mailOptions.subject = 'Sad to see you go :`(';
    mailOptions.text = 'I hereby confirm that I will stop sending you the newsletter.';
    return mailTransport.sendMail(mailOptions).then(() => {
        console.log('New unsubscription confirmation email sent to:', val.email);
    });
});
