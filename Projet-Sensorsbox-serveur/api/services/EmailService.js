var nodemailer = require('nodemailer');

/**
 * Send an email
 * @param {String} msg - HTML content of the mail
 * @param {String} subject - Subject of the mail
 * @param {String} to - receiver of the mail
 */

exports.sendMail = function(subject, msg, to, callback) {

	// mail settings
	var smtpTransport = nodemailer.createTransport('SMTP',{
		service: 'Gmail',
		auth: {
			user: 'sensorsbox@gmail.com',
			pass: process.env.EMAIL_PASSWORD
		}
	});

	// verify inputs
	var args = [msg, subject, to];

	var invalid = args.some(function(arg) {
		return typeof arg !== 'string' || arg === '';
	});

	if(invalid) {
		if (callback) callback(new Error('one or more arguments are invalid'));
	} else {
		var mailOptions = {
			generateTextFromHTML: true,
			from: 'SensorsBox<sensorsbox@gmail.com>', // sender address
			to: to, // list of receivers
			subject: subject, // Subject line
			html: msg // html body
		};

		// send mail with defined transport object
		smtpTransport.sendMail(mailOptions, function(err, response){
			if (callback) callback(err, response);
		});
	}
};


exports.sendError = function(subject, err, callback) {
	var subject = 'Error: ' + subject,
		to = 'vkammerer@gmail.com, xavier.seignard@gmail.com';
		msg = 'Measures destruction failure:\nerr:' + JSON.stringify(err) + '\n\nThe SensorsBox Server'

	this.sendMail(subject, msg, to, callback);
};
