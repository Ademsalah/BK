const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or outlook / custom SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendPrestataireEmail = async (to, name, tempPassword) => {
  const mailOptions = {
    from: `"Admin Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Prestataire Account Created",
    html: `
      <h2>Welcome ${name} 👋</h2>
      <p>Your prestataire account has been created by the administrator.</p>
      
      <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      
      <p>Please login and change your password immediately for security reasons.</p>
      
      <a href="http://localhost:5173/login">Login here</a>
      
      <br/><br/>
      <small>If you did not expect this, please contact support.</small>
    `,
  };

  await transporter.sendMail(mailOptions);
};
