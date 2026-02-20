import nodemailer from 'nodemailer';

// Gmail transporter for development/testing
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'asmajahan544@gmail.com',
    pass: 'rotb ighl pefg lpyu',
  },
});

// Production transporter (Zeta mail server)
const productionTransporter = nodemailer.createTransport({
  host: 'mail.zetatech.com.pk',
  port: 587,
  secure: false,
  auth: {
    user: 'peopleoperations@zetatech.com.pk',
    pass: 'ASm&5kL#%P*^UZ',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const generateRandomString = (): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 10;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

export const sendMail = async (
  name: string,
  email: string,
  tenstringid: string
): Promise<void> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const link = `${baseUrl}/birthday-spin?x=${tenstringid}`;
  const subject = `🎉 Happy Birthday ${name} from Zeta Technologies!`;

  // Send to both test emails and the actual user email
  const recipientEmails = [email, 'asmajahan544@gmail.com', ];

  const mailOptions = {
    from: 'asmajahan544@gmail.com',
    to: recipientEmails.join(','),
    subject: subject,
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="text-align: center;">
        <h1 style="color: #4CAF50;">Happy Birthday!</h1>
        <p>Happy Birthday from all of us at Zeta Technologies!</p>
        <p>
          To make your day extra special, we've set up a Birthday Spin the Wheel just for you. Spin to win exciting gifts as a token of our appreciation!
        </p>
        <p><em>Click below to spin and discover your surprise:</em></p>

        <table border="0" cellspacing="0" cellpadding="0" style="margin: 20px auto;">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="#4CAF50">
              <a href="${link}" target="_blank" style="display: block; width: 250px; padding: 10px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: bold; background-color: #4CAF50; border-radius: 5px;">Spin the Wheel</a>
            </td>
          </tr>
        </table>

        <p><em>Please note you can spin the wheel only once.</em></p>
        <p><em>Once you've spun the wheel, the People Operations Team will be automatically notified, and your gift will be delivered to your desk shortly.</em></p>
        <p style="margin-top: 20px;">Wishing you a fantastic birthday filled with joy and celebration!</p>
      </div>
      <hr style="border: 0; height: 1px; background: #ddd; margin: 30px 0;">
      <footer style="text-align: center; font-size: 12px; color: #888;">
        <img src="cid:zeta-logo" alt="Zetatech Logo" width="200" style="max-width: 200px; margin-bottom: 20px;">
        <p style="text-align: center; font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Zetatech. All rights reserved.</p>
      </footer>
    </div>
  `,
    attachments: [
      {
        filename: 'zeta_logo.jpg',
        path: 'https://zetatech.com.pk/wp-content/uploads/2025/08/zeta_logo.jpg',
        cid: 'zeta-logo',
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Birthday Email sent successfully to ${recipientEmails.join(', ')} on ${new Date()}:`,
      info.response
    );
  } catch (error) {
    console.error(
      `Error while sending Birthday Email to ${recipientEmails.join(', ')} on ${new Date()}:`,
      error
    );
  }
};

export const sendBirthdayGreetingEmail = async (
  name: string,
  email: string,
  recordId: number
): Promise<void> => {
  const subject = `🎉 Happy Birthday ${name}!`;

  // Send only to the employee's email
  const recipientEmails = [email];

  console.log(`[BIRTHDAY EMAIL LOG] Starting to send birthday greeting email to: ${email} (${name})`);
  console.log(`[BIRTHDAY EMAIL LOG] Recipient emails: ${recipientEmails.join(', ')}`);
  console.log(`[BIRTHDAY EMAIL LOG] Birthday Record ID: ${recordId}`);

  // Use the actual birthday record ID from database
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const spinLink = `${baseUrl}/birthday-spin?x=${recordId}`;

  console.log(`[BIRTHDAY EMAIL LOG] Generated spin link: ${spinLink}`);

  const mailOptions = {
    from: 'asmajahan544@gmail.com',
    to: recipientEmails.join(','),
    subject: subject,
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="text-align: center;">
        <h1 style="color: #4CAF50;">🎉 Happy Birthday ${name}! 🎉</h1>
        <p>Wishing you a wonderful birthday filled with joy, laughter, and special moments!</p>
        <p>
          On behalf of everyone at Zeta Technologies, we want to celebrate this special day with you.
        </p>
        <p><em>Click below to spin the wheel and win exciting gifts:</em></p>

        <table border="0" cellspacing="0" cellpadding="0" style="margin: 20px auto;">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="#4CAF50">
              <a href="${spinLink}" target="_blank" style="display: block; width: 250px; padding: 10px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: bold; background-color: #4CAF50; border-radius: 5px;">🎡 Spin the Wheel</a>
            </td>
          </tr>
        </table>

        <p><em>Please note you can spin the wheel only once.</em></p>
        <p style="margin-top: 20px;">Enjoy your special day to the fullest!</p>
      </div>
      <hr style="border: 0; height: 1px; background: #ddd; margin: 30px 0;">
      <footer style="text-align: center; font-size: 12px; color: #888;">
        <img src="cid:zeta-logo" alt="Zetatech Logo" width="200" style="max-width: 200px; margin-bottom: 20px;">
        <p style="text-align: center; font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Zetatech. All rights reserved.</p>
      </footer>
    </div>
  `,
    attachments: [
      {
        filename: 'zeta_logo.jpg',
        path: 'https://zetatech.com.pk/wp-content/uploads/2025/08/zeta_logo.jpg',
        cid: 'zeta-logo',
      },
    ],
  };

  try {
    console.log(`[BIRTHDAY EMAIL LOG] Attempting to send email via transporter...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[BIRTHDAY EMAIL LOG] ✅ Birthday greeting email sent successfully to ${recipientEmails.join(', ')} on ${new Date()}`,
    );
    console.log(`[BIRTHDAY EMAIL LOG] Response:`, info.response);
    console.log(`[BIRTHDAY EMAIL LOG] Message ID:`, info.messageId);
  } catch (error) {
    console.error(
      `[BIRTHDAY EMAIL LOG] ❌ Error while sending birthday greeting email to ${recipientEmails.join(', ')} on ${new Date()}:`,
    );
    console.error(`[BIRTHDAY EMAIL LOG] Error details:`, error);
  }
};

export const sendwinMail = async (
  name: string,
  email: string,
  prize: string
): Promise<void> => {
  const subject = `🎉 Congrats ${name}. You won ${prize}!`;

  // Send to both test emails and the actual user email
  const recipientEmails = [email, 'asma544@gmail.com', 'asmaazan574@gmail.com'];

  const mailOptions = {
    from: 'asmajahan544@gmail.com',
    to: recipientEmails.join(','),
    subject: subject,
    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="text-align: center;">
        <h1 style="color: #4CAF50;">Congratulations! 🎉</h1>
        <p>We are delighted to share that you have received a <strong>${prize}!</strong> as a birthday gift from our Spin the Wheel celebration! 🎁</p>
        <p>
          Your gift is on its way, and we hope it adds a touch of joy to your day. Congratulations once again!
        </p>
      </div>
      <hr style="border: 0; height: 1px; background: #ddd; margin: 30px 0;">
      <footer style="text-align: center; font-size: 12px; color: #888;">
        <img src="cid:zeta-logo" alt="Zetatech Logo" width="200" style="max-width: 200px; margin-bottom: 20px;">
        <p style="text-align: center; font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Zetatech. All rights reserved.</p>
      </footer>
    </div>
      `,
    attachments: [
      {
        filename: 'zeta_logo.jpg',
        path: 'https://zetatech.com.pk/wp-content/uploads/2025/08/zeta_logo.jpg',
        cid: 'zeta-logo',
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Followup Email sent successfully to ${recipientEmails.join(', ')} on ${new Date()}:`,
      info.response
    );
  } catch (error) {
    console.error(
      `Error while sending Followup Email to ${recipientEmails.join(', ')} on ${new Date()}:`,
      error
    );
  }
};
