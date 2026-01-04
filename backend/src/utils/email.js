const nodemailer = require('nodemailer');

/**
 * Create email transporter
 * Uses Gmail SMTP by default
 * For production, use services like SendGrid, AWS SES, or Mailgun
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
        },
    });
};

/**
 * Send OTP email
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP
 * @param {string} name - User's name (optional)
 */
const sendOTPEmail = async (to, otp, name = 'User') => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Flash E-Commerce" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Password Reset OTP - Flash',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background-color: #ffffff;
                            border-radius: 10px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            padding: 30px;
                            text-align: center;
                            color: white;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .otp-box {
                            background-color: #f8f9fa;
                            border: 2px dashed #667eea;
                            border-radius: 8px;
                            padding: 20px;
                            text-align: center;
                            margin: 30px 0;
                        }
                        .otp {
                            font-size: 36px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            color: #667eea;
                            font-family: 'Courier New', monospace;
                        }
                        .warning {
                            background-color: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                        .footer {
                            background-color: #f8f9fa;
                            padding: 20px;
                            text-align: center;
                            font-size: 12px;
                            color: #6c757d;
                        }
                        .button {
                            display: inline-block;
                            padding: 12px 30px;
                            background-color: #667eea;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Password Reset</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${name}!</h2>
                            <p>We received a request to reset your password. Use the OTP below to complete the process:</p>
                            
                            <div class="otp-box">
                                <p style="margin: 0; font-size: 14px; color: #6c757d;">Your OTP is:</p>
                                <div class="otp">${otp}</div>
                                <p style="margin: 10px 0 0 0; font-size: 12px; color: #6c757d;">Valid for 10 minutes</p>
                            </div>

                            <div class="warning">
                                <strong>⚠️ Security Notice:</strong><br>
                                • Never share this OTP with anyone<br>
                                • This OTP expires in 10 minutes<br>
                                • If you didn't request this, please ignore this email
                            </div>

                            <p style="color: #6c757d; font-size: 14px;">
                                If you didn't request a password reset, you can safely ignore this email. 
                                Your password will remain unchanged.
                            </p>
                        </div>
                        <div class="footer">
                            <p>This is an automated message from Flash E-Commerce</p>
                            <p>&copy; ${new Date().getFullYear()} Flash. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                Password Reset OTP - Flash
                
                Hello ${name},
                
                Your OTP for password reset is: ${otp}
                
                This OTP is valid for 10 minutes.
                
                If you didn't request this, please ignore this email.
                
                - Flash Team
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
};

/**
 * Send welcome email
 * @param {string} to - Recipient email
 * @param {string} name - User's name
 */
const sendWelcomeEmail = async (to, name) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Flash E-Commerce" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Welcome to Flash! 🎉',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #667eea;">Welcome to Flash, ${name}! 🎉</h1>
                    <p>Your account has been created successfully.</p>
                    <p>Start exploring our amazing products and courses!</p>
                    <a href="${process.env.FRONTEND_URL}" style="display: inline-block; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                        Start Shopping
                    </a>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent:', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        // Don't throw - welcome email is not critical
        return { success: false };
    }
};


/**
 * Send password reset confirmation
 */
const sendPasswordResetConfirmation = async (to, name = 'User') => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Flash E-Commerce" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Password Reset Successful - Flash',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white; }
                        .content { padding: 40px 30px; }
                        .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
                        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Password Reset Successful</h1>
                        </div>
                        <div class="content">
                            <div class="success-icon">🎉</div>
                            <h2>Hello ${name}!</h2>
                            <p>Your password has been successfully reset.</p>
                            <p>You can now log in with your new password.</p>
                            <p style="color: #dc3545; margin-top: 30px;"><strong>⚠️ Didn't make this change?</strong><br>Please contact us immediately to secure your account.</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated message from Flash E-Commerce</p>
                            <p>&copy; ${new Date().getFullYear()} Flash. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Password reset confirmation sent:', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending password reset confirmation:', error);
        return { success: false };
    }
};

/**
 * Send 2FA enabled notification with backup codes
 */
const send2FAEnabledNotification = async (to, name = 'User', backupCodes = []) => {
    try {
        const transporter = createTransporter();

        const backupCodesHTML = backupCodes.map((code, index) =>
            `<li style="margin: 5px 0;"><code style="background: #f0f0f0; padding: 5px 10px; border-radius: 4px; font-family: monospace;">${code}</code></li>`
        ).join('');

        const mailOptions = {
            from: `"Flash E-Commerce" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Two-Factor Authentication Enabled - Flash',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
                        .content { padding: 40px 30px; }
                        .backup-codes { background: #f8f9fa; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; }
                        .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
                        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 2FA Enabled Successfully</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${name}!</h2>
                            <p>Two-Factor Authentication has been successfully enabled on your account.</p>
                            
                            <div class="backup-codes">
                                <h3 style="margin-top: 0;">🔑 Your Backup Codes</h3>
                                <p>Save these codes in a safe place. Each code can be used once if you lose access to your email:</p>
                                <ul style="list-style: none; padding: 0;">
                                    ${backupCodesHTML}
                                </ul>
                            </div>

                            <div class="warning">
                                <strong>⚠️ Important:</strong> Store these backup codes securely. You won't be able to see them again!
                            </div>

                            <p>From now on, you'll need to enter a verification code sent to your email when logging in.</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated message from Flash E-Commerce</p>
                            <p>&copy; ${new Date().getFullYear()} Flash. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ 2FA enabled notification sent:', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending 2FA enabled notification:', error);
        return { success: false };
    }
};

module.exports = {
    sendOTPEmail,
    sendWelcomeEmail,
    send2FACode: sendOTPEmail,
    sendPasswordResetConfirmation,
    send2FAEnabledNotification,
};
