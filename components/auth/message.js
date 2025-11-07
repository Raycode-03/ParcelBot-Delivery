import transporter from "@/lib/transporter"

export async function sendmessage(email, name) {
    const mailOptions = {
        from: `"ParcelBot" <${process.env.EMAIL_ADMIN}>`,
        to: email,
        subject: 'Welcome to ParcelBot - Effortless Delivery Services!',
        text: `Hi ${name || 'friend'}, welcome to ParcelBot! Experience effortless delivery with our logistic services. Elevate your business with our end-to-end logistics solutions, seamlessly connecting customers with our dedicated riders for secure deliveries.`,
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">ParcelBot</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Effortless Delivery Solutions</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #667eea; margin-bottom: 20px;">Hi ${name || 'friend'}, 👋</h2>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          <strong>Welcome to ParcelBot!</strong> Elevate your business with our end-to-end logistics solutions, 
          seamlessly connecting customers with our dedicated riders for secure deliveries.
        </p>
        
        <p style="font-size: 16px; margin-bottom: 25px;">
          Experience convenience at every step - request pickups, drop-offs, and delivery services 
          with our efficient and reliable providers.
        </p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
          <h3 style="color: #667eea; margin-top: 0;">Here's what you can do:</h3>
          <ul style="margin-bottom: 0;">
            <li>🚚 Request pickup and delivery services</li>
            <li>📦 Track your parcels in real-time</li>
            <li>🤝 Connect with reliable delivery riders</li>
            <li>💼 Scale your business logistics effortlessly</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Get Started
          </a>
        </div>

        <p style="font-size: 16px;">
          We're excited to help streamline your delivery needs and make logistics effortless for your business!
        </p>

        <p style="margin-top: 30px;">
          Cheers,<br>
          <strong>The ParcelBot Team</strong>
        </p>
      </div>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 12px; color: #888; text-align: center;">
        You're receiving this email because you signed up for ParcelBot Delivery Services.
      </p>
    </div>
  `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('ParcelBot welcome email sent to:', email);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}

export async function sendcode(email, code) {
  const mailOptions = {
    from: `"Flowline" <${process.env.EMAIL_ADMIN}>`,
    to: email,
    subject: 'Your Password Reset Code',
    text: `Your password reset code is: ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4f46e5;">Hi there,</h2>
        <p>Your password reset code is: <strong>${code}</strong></p>
        <p>Please use this code to reset your password.</p>
        <p>Cheers,<br><strong>The Flowline Team</strong></p>
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