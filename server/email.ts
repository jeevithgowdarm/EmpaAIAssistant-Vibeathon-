import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) {
    return transporter;
  }

  const emailConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  if (!emailConfig.host || !emailConfig.auth.user || !emailConfig.auth.pass) {
    console.warn("Email not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM environment variables.");
    return null;
  }

  try {
    transporter = nodemailer.createTransport(emailConfig);
    return transporter;
  } catch (error) {
    console.error("Failed to create email transporter:", error);
    return null;
  }
}

function getBaseUrl(): string {
  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    return `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
  }
  const port = process.env.PORT || "5000";
  return `http://localhost:${port}`;
}

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const transport = getTransporter();
  if (!transport) {
    console.log(`[DEV MODE] Email verification link for ${email}:`);
    console.log(`${getBaseUrl()}/verify-email?token=${token}`);
    return true;
  }

  const verificationUrl = `${getBaseUrl()}/verify-email?token=${token}`;
  
  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Verify Your EmpaAI Account",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 40px 20px 40px; text-align: center;">
                        <h1 style="margin: 0; color: #2563EB; font-size: 28px; font-weight: 700;">
                          ❤️ EmpaAI
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 40px 40px 40px;">
                        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
                          Verify Your Email Address
                        </h2>
                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          Welcome to EmpaAI! We're excited to have you join our community dedicated to fostering inclusion, empathy, and accessibility.
                        </p>
                        <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          To complete your registration and start using EmpaAI's AI-powered communication tools, please verify your email address by clicking the button below:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                          <a href="${verificationUrl}" style="display: inline-block; background-color: #2563EB; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                            Verify Email Address
                          </a>
                        </div>
                        <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                          Or copy and paste this link into your browser:
                        </p>
                        <p style="margin: 8px 0 0 0; color: #2563EB; font-size: 14px; word-break: break-all;">
                          ${verificationUrl}
                        </p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                          This verification link will expire in 24 hours. If you didn't create an EmpaAI account, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                        <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center;">
                          © ${new Date().getFullYear()} EmpaAI - Bridging Communication, Empowering Lives
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
Welcome to EmpaAI!

To verify your email address and complete your registration, please visit:
${verificationUrl}

This link will expire in 24 hours.

If you didn't create an EmpaAI account, you can safely ignore this email.

© ${new Date().getFullYear()} EmpaAI - Bridging Communication, Empowering Lives
      `.trim(),
    });
    
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const transport = getTransporter();
  if (!transport) {
    console.log(`[DEV MODE] Password reset link for ${email}:`);
    console.log(`${getBaseUrl()}/reset-password?token=${token}`);
    return true;
  }

  const resetUrl = `${getBaseUrl()}/reset-password?token=${token}`;
  
  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Reset Your EmpaAI Password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 40px 20px 40px; text-align: center;">
                        <h1 style="margin: 0; color: #2563EB; font-size: 28px; font-weight: 700;">
                          ❤️ EmpaAI
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 40px 40px 40px;">
                        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
                          Reset Your Password
                        </h2>
                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          We received a request to reset the password for your EmpaAI account associated with this email address.
                        </p>
                        <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          To reset your password, click the button below:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                          <a href="${resetUrl}" style="display: inline-block; background-color: #2563EB; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                            Reset Password
                          </a>
                        </div>
                        <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                          Or copy and paste this link into your browser:
                        </p>
                        <p style="margin: 8px 0 0 0; color: #2563EB; font-size: 14px; word-break: break-all;">
                          ${resetUrl}
                        </p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        <p style="margin: 0 0 10px 0; color: #ef4444; font-size: 14px; font-weight: 600;">
                          Security Notice:
                        </p>
                        <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                          This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged. For security, we recommend changing your password if you suspect any unauthorized access.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                        <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center;">
                          © ${new Date().getFullYear()} EmpaAI - Bridging Communication, Empowering Lives
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
Reset Your Password

We received a request to reset the password for your EmpaAI account.

To reset your password, visit:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email and your password will remain unchanged.

© ${new Date().getFullYear()} EmpaAI - Bridging Communication, Empowering Lives
      `.trim(),
    });
    
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return false;
  }
}
