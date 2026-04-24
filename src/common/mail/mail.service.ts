import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: Number(this.config.get<string>('MAIL_PORT')),
      secure: false,
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
  }

async sendOtp(email: string, otp: string, subject: string) {
  await this.transporter.sendMail({
    from: this.config.get<string>('MAIL_FROM'),
    to: email,
    subject,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>

<body style="margin:0; padding:0; background:#f4f7fb; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08);">
          
          <tr>
            <td style="background:#111827; padding:28px 32px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700;">
                Verification Code
              </h1>
              <p style="margin:8px 0 0; color:#d1d5db; font-size:14px;">
                Secure account verification
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 32px 24px; text-align:center;">
              <h2 style="margin:0 0 12px; color:#111827; font-size:22px;">
                ${subject}
              </h2>

              <p style="margin:0; color:#4b5563; font-size:15px; line-height:24px;">
                Use the OTP code below to complete your verification.
              </p>

              <div style="margin:30px auto; background:#f3f4f6; border:1px dashed #9ca3af; border-radius:12px; padding:18px 24px; display:inline-block;">
                <span style="letter-spacing:8px; color:#111827; font-size:34px; font-weight:700;">
                  ${otp}
                </span>
              </div>

              <p style="margin:0; color:#6b7280; font-size:14px; line-height:22px;">
                This code will expire soon. Please do not share this code with anyone.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 32px;">
              <div style="background:#fff7ed; border-left:4px solid #f97316; padding:14px 16px; border-radius:8px;">
                <p style="margin:0; color:#9a3412; font-size:13px; line-height:20px;">
                  If you did not request this code, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background:#f9fafb; padding:20px 32px; text-align:center; border-top:1px solid #e5e7eb;">
              <p style="margin:0; color:#9ca3af; font-size:12px; line-height:18px;">
                This is an automated email. Please do not reply.
              </p>
              <p style="margin:6px 0 0; color:#9ca3af; font-size:12px;">
                © ${new Date().getFullYear()} Your Company. All rights reserved.
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
  });
}
}