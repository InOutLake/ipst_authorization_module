import nodemailer from "nodemailer";
import { config } from "./config";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.email,
    pass: config.email.password,
  },
});

export function mail(subject: string, message: string, destination: string) {
  let mailOptions = {
    from: config.email.email,
    to: destination,
    subject: subject,
    text: message,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log("Email sent: " + info);
    }
  });
}
