import transporter from "@/lib/transporter"
export async function sendmessage(email, message) {
const mailOptions = {
  from: `"RayCode Portfolio" <${process.env.EMAIL_ADMIN}>`, // the authenticated sender email
  to: process.env.EMAIL_RAY, // your personal or business inbox
  subject: `New Message from ${email || 'Anonymous'} via Portfolio`,
  text: `
You have a new message from your portfolio contact form:
Email: ${email}
Message:
${message}
  `,
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f9f9f9; padding: 20px; border-radius: 10px;">
      <h2 style="color: #1e40af;">📩 New Message from Your Portfolio</h2>
      
      <p><strong>Email:</strong> ${email}</p>
      
      <div style="margin-top: 20px; padding: 10px 15px; background: #fff; border-left: 4px solid #1e40af;">
        <p style="white-space: pre-wrap; margin: 0;">${message}</p>
      </div>

      <hr style="margin: 25px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 12px; color: #777;">Sent from your <strong>RayCode Portfolio</strong> contact form.</p>
    </div>
  `,
};
        try {
          await transporter.sendMail(mailOptions);
          console.log('Email notification sent');
        } catch (error) {
            console.error('Failed to send email:', error);
        }
}