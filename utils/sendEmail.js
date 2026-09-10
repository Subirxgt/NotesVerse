// import nodemailer from "nodemailer";
// console.log(process.env.SENDGRID_API_KEY);
// export const sendEmail=async({email,subject,message})=>{
//     // const transporter=nodemailer.createTransport(
//     //     {
//     //         host: process.env.SMTP_HOST,
//     //         service: process.env.SMTP_SERVICE,
//     //         port: process.env.SMTP_PORT,
//     //         auth:{
//     //             user: process.env.SMTP_EMAIL,
//     //             pass: process.env.SMTP_PASSWORD,
//     //         },

//     //     }
//     // );
//     const transporter = nodemailer.createTransport({
//         service: "SendGrid",
//         auth: {
//             user:"apikey",
//             api_key: process.env.SENDGRID_API_KEY,
//         },
//     });
    
//     const options={
//         from: process.env.SMTP_EMAIL,
//         to:email,
//         subject,
//         html:message,
//     };
//     await transporter.sendMail(options);
// }




// import sgMail from "@sendgrid/mail";

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// export const sendEmail = async ({ email, subject, message }) => {
//   const msg = {
//     to: email,
//     from: {
//       name: "StudyAdda",
//       email: `${process.env.SMTP_EMAIL}`, 
//     },
//     replyTo: `${process.env.SMTP_EMAIL}`,
//     subject,
//     text: "Hello! This is a message from StudyAdda.", 
//     html: `
//       <div style="font-family: Arial; color:#333;">
//         ${message}
//         <br/><br/>
//         <hr/>
//         <small>This email was sent by StudyAdda.</small>
//       </div>
//     `,
//   };

//   try {
//     await sgMail.send(msg);
//     console.log("✅ Email sent successfully");
//   } catch (error) {
//     console.error("❌ SendGrid error:", error);
//     if (error.response) {
//       console.error(error.response.body);
//     }
//   }
// };



const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});

module.exports.sendEmail = async ({ email, subject, message }) => {
    try {
        const response = await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: process.env.BREVO_SENDER_NAME,
                email: process.env.BREVO_SENDER_EMAIL
            },

            to: [
                {
                    email: email
                }
            ],

            replyTo: {
                email: process.env.BREVO_SENDER_EMAIL
            },

            subject: subject,

            textContent: message,

            htmlContent: `
                <div style="font-family: Arial; color:#333;">
                    ${message}
                    <br/><br/>
                    <hr/>
                    <small>This email was sent by StudyAdda.</small>
                </div>
            `
        });

        console.log("✅ Email sent successfully");

        return response;
    } catch (error) {
        console.error("❌ Brevo error:", error);
        throw error;
    }
};