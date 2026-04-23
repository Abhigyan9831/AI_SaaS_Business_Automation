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
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; padding: 40px 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="display: inline-block; width: 48px; height: 48px; background: #000; border-radius: 12px; line-height: 48px; color: #fff; font-size: 24px; font-weight: bold;">P</div>
          <h1 style="font-size: 24px; font-weight: 700; margin-top: 16px; letter-spacing: -0.02em;">Welcome to PONT AI</h1>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Hi ${name},</p>
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Your PONT GEO instance has been successfully deployed. We've initiated your <strong>30-day Free Trial</strong> with full access to the Xia worker nodes.</p>
        
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 32px; border-radius: 16px; margin: 32px 0;">
          <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin-top: 0; margin-bottom: 16px;">Getting Started</h3>
          <ul style="padding-left: 20px; color: #4b5563; line-height: 1.8;">
            <li>Ingest your first Knowledge Base document.</li>
            <li>Configure your GEO Keyword monitoring.</li>
            <li>Connect your external platform webhooks.</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="background: #000; color: #fff; padding: 16px 32px; text-decoration: none; border-radius: 100px; font-weight: 600; display: inline-block; font-size: 14px;">Access Your Console</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 40px 0;" />
        
        <p style="font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.5;">
          © 2026 PONT AI Control Plane<br />
          Modern Generative Engine Optimization<br />
          <a href="#" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> or <a href="#" style="color: #6b7280; text-decoration: underline;">Update Preferences</a>
        </p>
      </div>
    `;

    await this.send('Welcome to PONT AI: Deployment Successful', email, html);
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
