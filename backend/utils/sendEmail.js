import nodemailer from 'nodemailer';

export const sendResetEmail = async (email, link) => {
  try {
    console.log('📤 Attempting to send reset email to:', email);
    console.log('📧 Email config:', {
      user: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASS,
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    // Send email with better HTML
    const mailOptions = {
      from: `"Assignment Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - Assignment Platform',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container { 
                max-width: 600px; 
                margin: 20px auto; 
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; 
                padding: 30px 20px; 
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content { 
                padding: 30px 20px;
                background: white;
              }
              .button { 
                display: inline-block; 
                padding: 14px 30px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white !important; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0;
                font-weight: bold;
              }
              .button:hover {
                opacity: 0.9;
              }
              .link-box {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                word-break: break-all;
                margin: 20px 0;
                border-left: 4px solid #667eea;
              }
              .footer { 
                text-align: center; 
                padding: 20px;
                background: #f8f9fa;
                color: #666; 
                font-size: 12px;
              }
              .warning {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>We received a request to reset your password for your Assignment Platform account.</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center;">
                  <a href="${link}" class="button">Reset My Password</a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <div class="link-box">
                  <a href="${link}" style="color: #667eea;">${link}</a>
                </div>
                <div class="warning">
                  <strong>⏰ Important:</strong> This link will expire in 1 hour for security reasons.
                </div>
                <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                <p>For security reasons, we never ask for your password via email.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Assignment Platform. All rights reserved.</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (err) {
    console.error('❌ Email send error:', err);
    console.error('Error details:', {
      code: err.code,
      command: err.command,
      message: err.message,
    });
    throw err;
  }
};