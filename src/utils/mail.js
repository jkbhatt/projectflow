import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {

    // Create mailgen instance for email templates
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
          name : "Task Manager",
          link : "https://taskmanagerlink.com",
        },
    });

    // Generate plain text version of email
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

    // Generate HTML version of email
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    // Create nodemailer transporter using mailtrap SMTP credentials from .env
    const transporter = nodemailer.createTransport({
        host : process.env.MAILTRAP_SMTP_HOST, // mailtrap host
        port : process.env.MAILTRAP_SMTP_PORT, // mailtrap port 2525
        auth : {
            user : process.env.MAILTRAP_SMTP_USER, // mailtrap username
            pass : process.env.MAILTRAP_SMTP_PASS  // mailtrap password
        }
    });

    // Define email details
    const mail = {
        from : "jkbhatt2005@gmail.com", // sender address
        to : options.email,             // receiver address
        subject : options.subject,      // email subject
        text : emailTextual,            // plain text body
        html : emailHtml                // html body
    };

    // Send email and catch any errors
    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

// Email template for account verification
const emailVerificationMailgenContent = (username, verificationLink) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! We're excited to have you on board.",
      action: {
        instructions: "To verify your email, please click the button below:",
        button: {
          color: "#22BC66",
          text: "Verify Email",
          link: verificationLink, // verification url from controller
        },
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

// Email template for forgot password
const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "You requested to reset your password.",
      action: {
        instructions: "Click the button below to reset your password:",
        button: {
          color: "#FF6136",
          text: "Reset Password",
          link: passwordResetUrl, // reset url from controller
        },
      },
      outro: "If you didn't request this, you can safely ignore this email.",
    },
  };
};
console.log("USER:", process.env.MAILTRAP_SMTP_USER);
console.log("PASS:", process.env.MAILTRAP_SMTP_PASS);

// Export all functions
export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};