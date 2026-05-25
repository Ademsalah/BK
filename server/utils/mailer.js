const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or outlook / custom SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===============================
// PRESTATAIRE EMAIL
// ===============================
exports.sendPrestataireEmail = async (to, name, tempPassword) => {
  const mailOptions = {
    from: `"BKEvent Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Prestataire Account Created",
    html: `
      <div style="font-family: Arial, sans-serif; padding:20px;">
        <h2 style="color:#7c3aed;">Welcome ${name} 👋</h2>

        <p>
          Your prestataire account has been created by the administrator.
        </p>

        <p>
          <strong>Temporary Password:</strong> ${tempPassword}
        </p>

        <p>
          Please login and change your password immediately for security reasons.
        </p>

        <a 
          href="http://localhost:5173/login"
          style="display:inline-block;padding:12px 20px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px;margin-top:15px;"
        >
          Login Here
        </a>

        <br/><br/>

        <small style="color:gray;">
          If you did not expect this, please contact support.
        </small>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ===============================
// CLIENT / PARTICIPANT WELCOME EMAIL
// ===============================
exports.sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: `"BKEvent" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to BKEvent 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; padding:20px;">
        <h1 style="color:#7c3aed;">
          Welcome to BKEvent 🎉
        </h1>

        <p>
          Hello <strong>${name}</strong>,
        </p>

        <p>
          Your account has been successfully created.
        </p>

        <p>
          You can now explore events, book tickets, and enjoy amazing experiences with BKEvent.
        </p>

        <a 
          href="http://localhost:5173"
          style="display:inline-block;padding:12px 20px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px;margin-top:15px;"
        >
          Explore Events
        </a>

        <p style="margin-top:30px;color:gray;">
          Thank you for joining BKEvent ❤️
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
// ===============================
// TICKET CONFIRMATION EMAIL
// ===============================
exports.sendTicketEmail = async (to, userName, event, ticket) => {
  const mailOptions = {
    from: `"BKEvent" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎟️ Your Ticket Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; padding:20px;">
        <h2 style="color:#7c3aed;">🎟️ Ticket Confirmed</h2>

        <p>Hello <strong>${userName}</strong>,</p>

        <p>Your booking has been confirmed successfully.</p>

        <hr/>

        <h3>Event Details</h3>
        <p><strong>Title:</strong> ${event.title}</p>
        <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
        <p><strong>Location:</strong> ${event.location}</p>

        <hr/>

        <h3>Ticket Info</h3>
        <p><strong>Quantity:</strong> ${ticket.quantity}</p>
        <p><strong>Total Price:</strong> ${ticket.totalPrice} DT</p>

        <hr/>

        <p style="color:gray;">
          Please keep this email as your proof of purchase.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
