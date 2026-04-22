import nodemailer from 'nodemailer';

export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configurable via ENV for production (SMTP, SendGrid, etc.)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || 'placeholder_user',
        pass: process.env.SMTP_PASS || 'placeholder_pass',
      },
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #000;">Welcome to PONT AI</h1>
        <p>Hi ${name},</p>
        <p>Your PONT GEO instance has been successfully deployed. You are now on a <strong>30-day Free Trial</strong>.</p>
        <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Next steps:</strong></p>
          <ul>
            <li>Upload your knowledge base documents.</li>
            <li>Define your first 5 GEO keywords.</li>
            <li>Connect your social/chat platforms.</li>
          </ul>
        </div>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Go to Console</a>
        <p style="margin-top: 40px; font-size: 12px; color: #888;">© 2026 PONT AI · Generative Engine Optimization</p>
      </div>
    `;

    await this.send('Welcome to PONT AI', email, html);
  }

  async sendSubscriptionActiveEmail(email: string, plan: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #000;">Subscription Activated</h1>
        <p>Great news! Your <strong>${plan}</strong> plan is now active.</p>
        <p>Your resource quotas have been automatically updated. You can now access full GEO monitoring and advanced Xia worker nodes.</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">View Dashboard</a>
        <p style="margin-top: 40px; font-size: 12px; color: #888;">Thank you for choosing PONT AI.</p>
      </div>
    `;

    await this.send('PONT AI: Subscription Active', email, html);
  }

  async sendTrialEndingReminder(email: string, daysLeft: number) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #000;">Your Trial Ends in ${daysLeft} Days</h2>
        <p>This is a reminder that your PONT AI trial will expire soon. To prevent any interruption to your GEO engine and AI workers, please select a subscription plan.</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/pricing" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Upgrade Plan</a>
      </div>
    `;

    await this.send(`Action Required: ${daysLeft} days left in trial`, email, html);
  }

  private async send(subject: string, to: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: '"PONT AI" <noreply@pont-ai.com>',
        to,
        subject,
        html,
      });
      console.log(`[Mail] Sent: ${subject} to ${to}`);
    } catch (err) {
      console.error(`[Mail Error] Failed to send to ${to}:`, err);
    }
  }
}
