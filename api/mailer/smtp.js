const nodemailer = require('nodemailer');
const sesTransport = require('nodemailer-ses-transport');
const EmailTemplate = require('email-templates');
const logger = require('../helpers/logHelper');
const ses = require('../helpers/awsHelper').ses;

//For production sesTransport({ ses })
const transporter = nodemailer.createTransport(sesTransport({ ses }));
const { error, info } = logger;
const internals = {};
const FROM_EMAIL = 'Compass <admin@compassrecoverynetwork.com>';
const DEV_SERVER = true; // process.env.NODE_ENV !== 'production';

/**
 * Send Email via ses
 * @param to
 * @param cc
 * @param bcc
 * @param replyTo
 * @param subject
 * @param model
 * @param templateDir
 * @param attachments
 */
exports.send = async (to, cc, bcc = FROM_EMAIL, replyTo = FROM_EMAIL, subject, model, templateDir, attachments = []) => {
  try {
    if (DEV_SERVER && subject && subject.toLowerCase().indexOf('testing') <= -1) {
      subject = `TESTING - ${subject}`;
      info('Changing subject from dev server =>', DEV_SERVER, subject);
    }
    const template = await internals.emailTemplate(templateDir, { model });
    await internals.sendEmail(FROM_EMAIL, to, cc, bcc, replyTo, subject, model, template, attachments);
  } catch (err) {
    info('Error: Unable to send email');
    error(err);
  }
};

// === INTERNALS ===

/**
 * emailTemplate: Used to call email template and send data to template
 * @param context
 * @param templateDir
 * @returns {Promise.<void>}
 */
internals.emailTemplate = async (templateDir, context) => {
  const template = templateDir + '/' + templateDir.substr(templateDir.lastIndexOf('/') + 1);
  const email = new EmailTemplate();
  return await email.render(template, context);
};

/**
 * sendEmail: Used to send email
 * @param from
 * @param to
 * @param cc
 * @param bcc
 * @param replyTo
 * @param subject
 * @param model
 * @param bodyHtml
 * @param attachments
 * @returns {Promise.<void>}
 */
internals.sendEmail = async (from, to, cc, bcc, replyTo, subject, model, bodyHtml, attachments = []) => {
  const mailOptions = { from, to, cc, bcc, replyTo, subject, html: bodyHtml, attachments };
  await transporter.sendMail(mailOptions, (err, information) => {
    if (err) {
      error(err);
      return error(err);
    }
    
    info('envelope', information.envelope);
    info('messageId', information.messageId);
    
    return information.messageId;
  });
};

