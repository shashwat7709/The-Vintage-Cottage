import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  debug: true, // Enable debug logs
});

// Verify SMTP connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

// Function to send a single email
export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    console.log('Attempting to send email to:', to);
    
    const mailOptions = {
      from: {
        name: 'Gilded Heritage Emporium',
        address: process.env.EMAIL_FROM!
      },
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    console.error('SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
      // Don't log the password
    });
    throw error;
  }
};

// Function to send bulk emails (for newsletters)
export const sendBulkEmail = async ({ to, subject, html }: EmailOptions) => {
  if (Array.isArray(to)) {
    // Split recipients into chunks of 50 to avoid rate limits
    const chunks = to.reduce((acc: string[][], curr, i) => {
      const chunkIndex = Math.floor(i / 50);
      if (!acc[chunkIndex]) {
        acc[chunkIndex] = [];
      }
      acc[chunkIndex].push(curr);
      return acc;
    }, []);

    // Send emails to each chunk with a delay
    for (const chunk of chunks) {
      try {
        await sendEmail({ to: chunk, subject, html });
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between chunks
      } catch (error) {
        console.error('Error sending bulk email to chunk:', error);
        throw error;
      }
    }
  } else {
    await sendEmail({ to, subject, html });
  }
};

// Function to send verification email
export const sendVerificationEmail = async (email: string, token: string) => {
  console.log('Sending verification email to:', email);
  
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: #4A3E3E; font-family: serif;">Welcome to Our Heritage Circle!</h1>
      
      <p>Dear Heritage Enthusiast,</p>
      
      <p>Thank you for joining our Heritage Circle! We're thrilled to have you as part of our community of antique and heritage enthusiasts.</p>
      
      <p>To start receiving our newsletters, please verify your email address by clicking the button below:</p>
      
      <a href="${verificationUrl}"
         style="display: inline-block; padding: 12px 24px; background-color: #4A3E3E; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Verify Email Address
      </a>
      
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p>${verificationUrl}</p>
      
      <p>This link will expire in 24 hours.</p>
      
      <p style="color: #666; font-size: 14px; margin-top: 40px;">
        If you didn't request this verification, you can safely ignore this email.
      </p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          © 2024 Gilded Heritage Emporium. All rights reserved.
        </p>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      to: email,
      subject: 'Welcome to Heritage Circle - Please Verify Your Email',
      html,
    });
    console.log('Verification email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}; 