const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "6b313c39d70459",
    pass: "e21181066ab981",
  },
});

const OtpMailer = async (receiver_mail, otp_code) => {
  try {
    const otp_html_mail = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
<div style="margin:50px auto;width:70%;padding:20px 0">
  <div style="border-bottom:1px solid #eee">
    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Hi ${receiver_mail}</a>
  </div>
  <p style="font-size:1.1em">Hi,</p>
  <p>Thank you for choosing Your Us. Use the following OTP to complete your Sign Up procedures.</p>
  <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp_code}</h2>
  <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
  <hr style="border:none;border-top:1px solid #eee" />
  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    <p>Your Brand Inc</p>
    <p>1600 Amphitheatre Parkway</p>
    <p>California</p>
  </div>
</div>
</div>`;

    const info = await transporter.sendMail({
      from: "izaansaquib@gmail.com", // sender address
      to: receiver_mail, // list of receivers
      subject: "Hello ✔ OTP Code", // Subject line
      text: `Hello world? your OTP is ${otp_code}`, // plain text body
      html: otp_html_mail, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
   return err
  }
};

OtpMailer().catch((err) => {
  console.error(err.message);
});

module.exports = OtpMailer;
