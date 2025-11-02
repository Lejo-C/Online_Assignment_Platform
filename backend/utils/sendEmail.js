import nodemailer from 'nodemailer';

export const sendResetEmail = async (email, link) => {
  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  socketTimeout: 10000, // 10 seconds
});


try {
  console.log('📤 Sending reset email to:', email);
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
  });
  console.log('✅ Email sent');
} catch (err) {
  console.error('❌ Email send error:', err);
}
};