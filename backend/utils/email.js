const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function escapeHtml(s) {
  if (s === undefined || s === null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateLong(value) {
  if (value === undefined || value === null || value === "") return "—";
  try {
    let d;
    if (value instanceof Date) {
      d = value;
    } else {
      const str = String(value);
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        d = new Date(`${str}T12:00:00`);
      } else {
        d = new Date(str);
      }
    }
    if (Number.isNaN(d.getTime())) return escapeHtml(String(value));
    return new Intl.DateTimeFormat("en", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return escapeHtml(String(value));
  }
}

// ===============================
// PENDING EMAIL
// ===============================
const sendPendingEmail = async (to, name, room, checkin, checkout) => {
  const guestName = escapeHtml(name);
  const roomName = escapeHtml(room);
  const checkinDate = escapeHtml(checkin);
  const checkoutDate = escapeHtml(checkout);

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;background:#f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#1f4d3a;color:#ffffff;padding:20px 24px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.9;">Green Valley Resort</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;">Booking Request Received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Dear ${guestName},</p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#4b5563;">
                Thank you for choosing Green Valley Resort. We have received your booking request and our team is currently reviewing it.
              </p>
              <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#1f2937;text-transform:uppercase;letter-spacing:0.05em;">Request Details</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:24px;">
                <tr>
                  <td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;color:#1f2937;width:40%;">Suite / Room</td>
                  <td style="padding:10px 14px;border:1px solid #e5e7eb;color:#374151;">${roomName}</td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;color:#1f2937;width:40%;">Check-in</td>
                  <td style="padding:10px 14px;border:1px solid #e5e7eb;color:#374151;">${checkinDate}</td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;color:#1f2937;width:40%;">Check-out</td>
                  <td style="padding:10px 14px;border:1px solid #e5e7eb;color:#374151;">${checkoutDate}</td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;color:#1f2937;width:40%;">Status</td>
                  <td style="padding:10px 14px;border:1px solid #e5e7eb;color:#d97706;font-weight:600;">Pending Approval</td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#4b5563;">
                You will receive another email shortly once your booking has been confirmed by our management.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5;">
                This is an automated message regarding your booking request.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Booking Request Received - Green Valley Resort",
    html,
  });
};

// ===============================
// CONTACT EMAIL (to admin)
// ===============================
const sendContactEmail = async (name, email, subject, message) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Contact Form: ${subject}`,
    html: `
      <h3>New Message</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Message:</b></p>
      <p>${message}</p>
    `,
  });
};

// ===============================
// CONFIRM EMAIL (full booking row)
// ===============================
/**
 * @param {object} booking — row from `bookings` (id, name, email, contact, room, checkin, checkout, people, …)
 */
const sendConfirmEmail = async (booking) => {
  const ref = `GVR-${booking.id}`;
  const contactEmail = (
    process.env.RESORT_PUBLIC_EMAIL ||
    process.env.EMAIL_USER ||
    ""
  ).trim();

  const guestName = escapeHtml(booking.name);
  const guestEmail = escapeHtml(booking.email);
  const contact = escapeHtml(booking.contact);
  const room = escapeHtml(booking.room);
  const people = escapeHtml(String(booking.people));
  const checkin = formatDateLong(booking.checkin);
  const checkout = formatDateLong(booking.checkout);

  const rows = [
    ["Confirmation reference", ref],
    ["Guest name", guestName],
    ["Contact number", contact],
    ["Email", guestEmail],
    ["Suite / room", room],
    ["Check-in", checkin],
    ["Check-out", checkout],
    ["Number of guests", people],
    ["Status", "Confirmed"],
  ];

  const tableRows = rows
    .map(
      ([label, val]) =>
        `<tr>
          <td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;color:#1f2937;width:40%;">${label}</td>
          <td style="padding:10px 14px;border:1px solid #e5e7eb;color:#374151;">${val}</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;background:#f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#1f4d3a;color:#ffffff;padding:20px 24px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.9;">Green Valley Resort</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;">Reservation confirmed</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Dear ${guestName},</p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#4b5563;">
                We are pleased to confirm your reservation with us. Please review the details below and retain this message for your records.
              </p>
              <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#1f2937;text-transform:uppercase;letter-spacing:0.05em;">Reservation summary</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:24px;">
                ${tableRows}
              </table>
              <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#4b5563;">
                We look forward to welcoming you to Green Valley Resort.
              </p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">
                ${
                  contactEmail
                    ? `If you need to amend or cancel your stay, please email us at <a href="mailto:${escapeHtml(
                        contactEmail
                      )}" style="color:#1f4d3a;">${escapeHtml(
                        contactEmail
                      )}</a> at your earliest convenience.`
                    : "If you need to amend or cancel your stay, please contact us using the details on our website at your earliest convenience."
                }
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5;">
                This is an automated message regarding your booking. Please do not reply to this email unless the address above is monitored.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: booking.email,
    subject: `Reservation confirmed – Green Valley Resort (Ref: ${ref})`,
    html,
  });
};

// ===============================
// REJECT EMAIL
// ===============================
const sendRejectEmail = async (to, name) => {
  const guestName = escapeHtml(name);

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;background:#f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#7f1d1d;color:#ffffff;padding:20px 24px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.9;">Green Valley Resort</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;">Booking Update</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Dear ${guestName},</p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#4b5563;">
                We regret to inform you that we are unable to confirm your booking for the requested dates. Our suites are fully booked or unavailable during this period.
              </p>
              <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#4b5563;">
                We sincerely apologize for any inconvenience this may cause. We would love to host you in the future, please feel free to check alternative dates on our website.
              </p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">
                If you have any questions, please contact our support team.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5;">
                This is an automated message regarding your booking request.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Booking Update - Green Valley Resort",
    html,
  });
};

module.exports = {
  sendPendingEmail,
  sendContactEmail,
  sendConfirmEmail,
  sendRejectEmail,
};
