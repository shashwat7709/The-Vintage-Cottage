import { Request, Response } from 'express';
import Subscriber from '../lib/db/models/Subscriber';
import { connectDB } from '../lib/db/connection';
import { sendEmail } from '../lib/email';
import crypto from 'crypto';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.isVerified) {
        return res.status(400).json({ error: 'Email already subscribed' });
      }
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create or update subscriber
    const subscriber = existingSubscriber || new Subscriber({
      email,
      verificationToken,
      verificationExpires,
    });

    if (existingSubscriber) {
      subscriber.verificationToken = verificationToken;
      subscriber.verificationExpires = verificationExpires;
    }

    await subscriber.save();

    // Send welcome email immediately
    const welcomeHtml = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #4A3E3E; font-family: serif;">Welcome to Our Heritage Circle!</h1>
        
        <p>Dear Heritage Enthusiast,</p>
        
        <p>Thank you for joining our Heritage Circle! We're thrilled to have you as part of our community of antique and heritage enthusiasts.</p>
        
        <p>As a member, you'll receive:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin: 10px 0; padding-left: 20px; position: relative;">
            ✨ Exclusive updates about new arrivals
          </li>
          <li style="margin: 10px 0; padding-left: 20px; position: relative;">
            🎉 Special invitations to cultural events
          </li>
          <li style="margin: 10px 0; padding-left: 20px; position: relative;">
            💫 Insights into Indian heritage and antiques
          </li>
          <li style="margin: 10px 0; padding-left: 20px; position: relative;">
            🎁 Early access to special offers
          </li>
        </ul>

        <p>To start receiving our newsletters, please verify your email address by clicking the button below:</p>
        
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationToken}"
           style="display: inline-block; padding: 12px 24px; background-color: #4A3E3E; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Verify Email Address
        </a>

        <p style="color: #666; font-size: 14px; margin-top: 40px;">
          If you didn't request this subscription, you can safely ignore this email.
        </p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            © 2024 Gilded Heritage Emporium. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'Welcome to Heritage Circle - Please Verify Your Email',
      html: welcomeHtml,
    });

    res.status(200).json({ 
      message: 'Please check your email to verify your subscription',
      email 
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
} 