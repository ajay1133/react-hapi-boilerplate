const nodemailer = require('nodemailer');
const sesTransport = require('nodemailer-ses-transport');
const EmailTemplate = require('email-templates');
const logger = require('../helpers/logHelper');
const ses = require('../helpers/awsHelper').ses;
const config = require('config');
//For production sesTransport({ ses })
const transporter = nodemailer.createTransport(sesTransport({ ses }));
const internals = {};
const FROM_EMAIL = 'Fan Engagement <mohits@simsaw.com>';

exports.send = (to, subject, model, templateDir) =>
  new Promise((resolve, reject) => {
    internals
      .sendEmail(FROM_EMAIL, to, subject, model, templateDir)
      .then(function(result) {
          resolve(result)
      }).catch(err => {
        logger.error(err);
        console.log('This is error', err);
        reject('Unable to send email');
      });
  });

internals.sendEmail = (FROM_EMAIL, to, subject, model, templateDir) => {
  return transporter.sendMail({
      from: FROM_EMAIL,
      to: to,
      subject: subject,
      text: 'Hi ' + model.name + ', \n\r Please use link to verify your account ' + model.invitelink,
      ses: { // optional extra arguments for SendRawEmail
          Tags: [{
              Name: 'Confirmation',
              Value: 'Email'
          }]
      }
  });
  // const email = new EmailTemplate({
  //   message: {
  //     from: FROM_EMAIL
  //   },
  //   views: {
  //     root: templateDir
  //   },
  //   transport: transporter
  // });

  // return new Promise((resolve, reject) => {
  //   email.send({
  //     template: 'templates',
  //     message: {
  //       to: to,
  //       templates: 'templates',
  //     },
  //     send: true,
  //     locals: {
  //       subject: subject,
  //       model: model
  //     }

  //   }).then(function(result) {
  //       resolve(result)
  //   }).catch(ex => {
  //       reject(ex.message);
  //   });
  // });
};
