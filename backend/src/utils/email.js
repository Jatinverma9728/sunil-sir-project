const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

/**
 * Professional color palette - Sophisticated, corporate, modern
 * Primary: Deep Navy (#1a2332)
 * Secondary: Slate Blue (#475569)
 * Accent: Royal Blue (#3b82f6)
 * Success: Forest Green (#047857)
 * Warning: Amber (#d97706)
 */

/**
 * Send OTP email with copy button
 */
const sendOTPEmail = async (to, otp, name = 'User') => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Flash" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Verification Code - Flash',
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
    
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
            <td align="center">
                
                <!-- Main Container -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 48px 48px 40px 48px; text-align: center; border-bottom: 4px solid #3b82f6;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Logo/Brand -->
                                        <div style="background: white; width: 64px; height: 64px; border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);">
                                            <span style="font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1px;">F</span>
                                        </div>
                                        
                                        <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Flash</h1>
                                        <p style="margin: 8px 0 0 0; color: #cbd5e1; font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">VERIFICATION CODE</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 48px 48px 32px 48px;">
                            
                            <!-- Greeting -->
                            <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 24px; font-weight: 700; line-height: 1.2;">
                                Hello, ${name}
                            </h2>
                            
                            <p style="margin: 0 0 32px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                                We received a request to verify your account. Please use the code below to complete your verification.
                            </p>

                            <!-- OTP Container -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 32px 0;">
                                <tr>
                                    <td style="background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%); border: 2px solid #e2e8f0; border-radius: 12px; padding: 32px; text-align: center; position: relative;">
                                        
                                        <p style="margin: 0 0 16px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px;">
                                            Your Verification Code
                                        </p>
                                        
                                        <!-- OTP Code -->
                                        <div id="otp-code" style="background: white; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; margin: 0 0 20px 0; display: inline-block; min-width: 240px;">
                                            <span style="color: #1e293b; font-size: 42px; font-weight: 800; letter-spacing: 12px; font-family: 'Courier New', monospace; line-height: 1;">
                                                ${otp}
                                            </span>
                                        </div>
                                        
                                        <!-- Copy Button -->
                                        <div style="margin: 0;">
                                            <button onclick="copyOTP()" id="copy-btn" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; border-radius: 8px; padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3); outline: none;">
                                                <span style="display: inline-flex; align-items: center; gap: 8px;">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align: middle;">
                                                        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                                                        <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
                                                    </svg>
                                                    Copy Code
                                                </span>
                                            </button>
                                        </div>
                                        
                                        <p style="margin: 20px 0 0 0; color: #64748b; font-size: 13px; font-weight: 500;">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; margin-right: 4px;">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                            </svg>
                                            Expires in 10 minutes
                                        </p>
                                        
                                        <!-- JavaScript for Copy Functionality -->
                                        <script>
                                            function copyOTP() {
                                                const otp = '${otp}';
                                                const btn = document.getElementById('copy-btn');
                                                
                                                // Modern Clipboard API
                                                if (navigator.clipboard && navigator.clipboard.writeText) {
                                                    navigator.clipboard.writeText(otp).then(function() {
                                                        // Success feedback
                                                        btn.style.background = 'linear-gradient(135deg, #047857 0%, #059669 100%)';
                                                        btn.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 8px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align: middle;"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Copied!</span>';
                                                        
                                                        setTimeout(function() {
                                                            btn.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                                                            btn.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 8px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align: middle;"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/></svg> Copy Code</span>';
                                                        }, 2000);
                                                    }).catch(function() {
                                                        // Fallback
                                                        fallbackCopy(otp, btn);
                                                    });
                                                } else {
                                                    // Fallback for older browsers
                                                    fallbackCopy(otp, btn);
                                                }
                                            }
                                            
                                            function fallbackCopy(text, btn) {
                                                const textArea = document.createElement('textarea');
                                                textArea.value = text;
                                                textArea.style.position = 'fixed';
                                                textArea.style.left = '-999999px';
                                                document.body.appendChild(textArea);
                                                textArea.select();
                                                
                                                try {
                                                    document.execCommand('copy');
                                                    btn.style.background = 'linear-gradient(135deg, #047857 0%, #059669 100%)';
                                                    btn.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 8px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Copied!</span>';
                                                    
                                                    setTimeout(function() {
                                                        btn.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                                                        btn.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 8px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/></svg> Copy Code</span>';
                                                    }, 2000);
                                                } catch (err) {
                                                    alert('Code copied: ' + text);
                                                }
                                                
                                                document.body.removeChild(textArea);
                                            }
                                        </script>
                                        
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Info -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 32px 0;">
                                <tr>
                                    <td style="background: linear-gradient(to bottom, #fef2f2 0%, #fee2e2 100%); border-left: 4px solid #dc2626; border-radius: 8px; padding: 20px 24px;">
                                        <p style="margin: 0 0 12px 0; color: #7f1d1d; font-size: 14px; font-weight: 700; display: flex; align-items: center;">
                                            <span style="display: inline-block; width: 20px; height: 20px; background: #dc2626; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 20px; color: white; font-size: 12px;">!</span>
                                            Security Notice
                                        </p>
                                        <ul style="margin: 0; padding-left: 20px; color: #991b1b; font-size: 13px; line-height: 1.8;">
                                            <li style="margin-bottom: 4px;">Never share this code with anyone, including Flash support</li>
                                            <li style="margin-bottom: 4px;">This code will expire in 10 minutes</li>
                                            <li>If you didn't request this code, please ignore this email</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>

                            <!-- Help Text -->
                            <div style="text-align: center; padding: 24px 0; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">
                                    Need assistance?
                                </p>
                                <a href="mailto:support@flash.com" style="color: #3b82f6; text-decoration: none; font-weight: 600; font-size: 14px;">
                                    Contact Support →
                                </a>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: #f8fafc; padding: 32px 48px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                                This is an automated message. Please do not reply to this email.
                            </p>
                            <p style="margin: 0 0 16px 0; color: #cbd5e1; font-size: 11px;">
                                © ${new Date().getFullYear()} Flash. All rights reserved.
                            </p>
                            <div style="margin-top: 16px;">
                                <a href="${process.env.FRONTEND_URL || '#'}/privacy" style="color: #94a3b8; text-decoration: none; font-size: 11px; margin: 0 8px;">Privacy Policy</a>
                                <span style="color: #cbd5e1;">•</span>
                                <a href="${process.env.FRONTEND_URL || '#'}/terms" style="color: #94a3b8; text-decoration: none; font-size: 11px; margin: 0 8px;">Terms of Service</a>
                                <span style="color: #cbd5e0;">•</span>
                                <a href="${process.env.FRONTEND_URL || '#'}/help" style="color: #94a3b8; text-decoration: none; font-size: 11px; margin: 0 8px;">Help Center</a>
                            </div>
                        </td>
                    </tr>

                </table>
                
            </td>
        </tr>
    </table>

</body>
</html>
            `,
            text: `Flash - Verification Code\n\nHello ${name},\n\nYour verification code is: ${otp}\n\nThis code is valid for 10 minutes.\n\nSecurity Tips:\n• Never share this code\n• Flash support will never ask for this\n• Ignore if you didn't request this\n\n© ${new Date().getFullYear()} Flash.`,
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
 */
const sendWelcomeEmail = async (to, name) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Flash" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Welcome to Flash - Your Journey Begins',
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
            <td align="center">
                
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 48px; text-align: center; border-bottom: 4px solid #3b82f6;">
                            <div style="background: white; width: 64px; height: 64px; border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);">
                                <span style="font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">F</span>
                            </div>
                            <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700;">Welcome to Flash</h1>
                            <p style="margin: 12px 0 0 0; color: #cbd5e1; font-size: 16px;">Your premium shopping experience starts here</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 48px;">
                            
                            <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 24px; font-weight: 700;">
                                Hello, ${name}!
                            </h2>
                            
                            <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                                We're thrilled to have you join our community. Get ready to discover premium products and exclusive courses.
                            </p>

                            <!-- Features -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 32px 0;">
                                <tr>
                                    <td style="background: linear-gradient(to bottom, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 24px;">
                                        <h3 style="margin: 0 0 16px 0; color: #0c4a6e; font-size: 18px; font-weight: 700;">What's Next?</h3>
                                        <ul style="margin: 0; padding-left: 20px; color: #0369a1; font-size: 14px; line-height: 2;">
                                            <li>Browse our curated product collection</li>
                                            <li>Enroll in premium courses</li>
                                            <li>Track your orders in real-time</li>
                                            <li>Enjoy exclusive member benefits</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="${process.env.FRONTEND_URL || '#'}/products" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);">
                                    Start Shopping →
                                </a>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                                © ${new Date().getFullYear()} Flash. All rights reserved.
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
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent:', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
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
            from: `"Flash" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Password Reset Successful - Flash',
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
            <td align="center">
                
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #047857 0%, #059669 100%); padding: 48px; text-align: center; border-bottom: 4px solid #10b981;">
                            <div style="font-size: 64px; margin-bottom: 16px;">✓</div>
                            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">Password Reset Successful</h1>
                            <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Your account is secure</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 48px;">
                            
                            <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 24px; font-weight: 700;">
                                All set, ${name}!
                            </h2>
                            
                            <p style="margin: 0 0 32px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                                Your password has been successfully reset. You can now log in with your new password.
                            </p>

                            <!-- CTA -->
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="${process.env.FRONTEND_URL || '#'}/login" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);">
                                    Login Now →
                                </a>
                            </div>

                            <!-- Warning -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 32px 0 0 0;">
                                <tr>
                                    <td style="background: linear-gradient(to bottom, #fef2f2 0%, #fee2e2 100%); border-left: 4px solid #dc2626; border-radius: 8px; padding: 20px;">
                                        <p style="margin: 0; color: #7f1d1d; font-size: 14px; font-weight: 600;">
                                            ⚠️ Didn't make this change?
                                        </p>
                                        <p style="margin: 12px 0 0 0; color: #991b1b; font-size: 13px; line-height: 1.6;">
                                            If you didn't reset your password, please contact our support team immediately to secure your account.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                                © ${new Date().getFullYear()} Flash. All rights reserved.
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
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Password reset confirmation sent:', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending password reset confirmation:', error);
        return { success: false };
    }
};

module.exports = {
    sendOTPEmail,
    sendWelcomeEmail,
    sendPasswordResetConfirmation,
};
