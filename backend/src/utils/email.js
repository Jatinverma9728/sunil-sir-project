const { Resend } = require('resend');

/**
 * Initialize Resend with the API key from environment variables
 */
const getResendInstance = () => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('❌ RESEND_API_KEY is not defined in the environment variables.');
    }
    return new Resend(process.env.RESEND_API_KEY);
};

/**
 * Premium Cohesive Email Template Shell
 * Wraps content in a highly-polished, modern, tech-oriented responsive design.
 */
const getEmailLayout = (title, subtitle, contentHtml, cta = null, themeColor = '#6366f1') => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; border-radius: 0 !important; border-left: none !important; border-right: none !important; }
            .header, .body, .footer { padding: 30px 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; line-height: 1.6; color: #334155; -webkit-font-smoothing: antialiased;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table class="container" role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0;">
                    <!-- Header -->
                    <tr>
                        <td class="header" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 48px 48px 40px 48px; text-align: center; border-bottom: 4px solid ${themeColor};">
                            <div style="background: linear-gradient(135deg, ${themeColor} 0%, #4F46E5 100%); width: 60px; height: 60px; border-radius: 18px; margin: 0 auto 18px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);">
                                <span style="font-family: 'Outfit', sans-serif; font-size: 30px; font-weight: 800; color: white; line-height: 60px;">N</span>
                            </div>
                            <h1 style="margin: 0; color: white; font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2;">North Tech Hub</h1>
                            ${subtitle ? `<p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">${subtitle}</p>` : ''}
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td class="body" style="padding: 48px 48px 36px 48px;">
                            ${contentHtml}
                            
                            ${cta ? `
                            <div style="text-align: center; margin: 36px 0 20px;">
                                <a href="${cta.url}" style="display: inline-block; background: linear-gradient(135deg, ${themeColor} 0%, #4F46E5 100%); color: white; text-decoration: none; padding: 15px 36px; border-radius: 14px; font-weight: 600; font-size: 15px; box-shadow: 0 6px 20px rgba(99, 102, 241, 0.25); transition: all 0.2s;">
                                    ${cta.text}
                                </a>
                            </div>
                            ` : ''}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td class="footer" style="background: #f8fafc; padding: 36px 48px; text-align: center; border-top: 1px solid #f1f5f9; border-radius: 0 0 24px 24px;">
                            <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 13px;">
                                Need help? Contact us at <a href="mailto:northtechhub2003@gmail.com" style="color: ${themeColor}; text-decoration: none; font-weight: 600;">northtechhub2003@gmail.com</a>
                            </p>
                            <p style="margin: 0 0 16px 0; color: #cbd5e1; font-size: 11px;">
                                This is an automated notification from North Tech Hub. Please do not reply.
                            </p>
                            <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                                © ${new Date().getFullYear()} North Tech Hub. All rights reserved.
                            </p>
                            <div style="margin-top: 16px; font-size: 11px;">
                                <a href="${process.env.FRONTEND_URL || 'https://northtechhub.in'}/privacy" style="color: #94a3b8; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                                <span style="color: #cbd5e1;">•</span>
                                <a href="${process.env.FRONTEND_URL || 'https://northtechhub.in'}/terms" style="color: #94a3b8; text-decoration: none; margin: 0 8px;">Terms of Service</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

/**
 * Dispatch an email using the Resend SDK
 */
const sendResendEmail = async (to, subject, html) => {
    try {
        const resend = getResendInstance();
        const fromAddress = process.env.EMAIL_FROM || 'North Tech Hub <onboarding@resend.dev>';
        const toArray = Array.isArray(to) ? to : [to];

        console.log(`📧 Sending email: "${subject}" to ${toArray.join(', ')}`);
        
        const { data, error } = await resend.emails.send({
            from: fromAddress,
            to: toArray,
            subject,
            html,
        });

        if (error) {
            console.error('❌ Resend API returned error:', error);
            throw new Error(error.message);
        }

        console.log('✅ Resend email dispatched successfully, Message ID:', data.id);
        return { success: true, messageId: data.id };
    } catch (error) {
        console.error('❌ Failed to dispatch email via Resend:', error.message);
        throw error;
    }
};

/**
 * Send OTP email
 */
const sendOTPEmail = async (to, otp, name = 'User') => {
    const title = 'Verification Code';
    const content = `
        <h2 style="margin: 0 0 16px 0; color: #0f172a; font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 600;">Hello ${name},</h2>
        <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">We received a request to verify your account. Please use the following one-time verification code to proceed.</p>
        
        <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 28px; text-align: center; margin: 24px 0;">
            <span style="color: #0f172a; font-family: monospace; font-size: 38px; font-weight: 700; letter-spacing: 8px; line-height: 1;">${otp}</span>
            <p style="margin: 12px 0 0 0; color: #64748b; font-size: 12px; font-weight: 500;">Valid for 10 minutes</p>
        </div>
        
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <h4 style="margin: 0 0 6px 0; color: #78350f; font-size: 14px; font-weight: 600;">Security Notice</h4>
            <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">Never share this OTP code with anyone, including North Tech Hub support staff. If you did not request this, please ignore this email.</p>
        </div>
    `;
    const html = getEmailLayout(title, 'Verification Required', content, null, '#6366f1');
    return sendResendEmail(to, 'Verification Code - North Tech Hub', html);
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (to, name) => {
    const title = 'Welcome to North Tech Hub';
    const content = `
        <h2 style="margin: 0 0 16px 0; color: #0f172a; font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 600;">Welcome, ${name}!</h2>
        <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">We are thrilled to have you join our community. Get ready to explore premium products and expert-led tech courses designed to accelerate your career.</p>
        
        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 16px; padding: 24px; border: 1px solid #bfdbfe; margin: 24px 0;">
            <h3 style="margin: 0 0 12px 0; color: #1e3a8a; font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 600;">What's in store for you?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.8;">
                <li>Genuine electronics, accessories, & gadgets at best prices</li>
                <li>Expert-led programming, coding, and web development courses</li>
                <li>Fast shipping and dedicated support to help you along the way</li>
            </ul>
        </div>
    `;
    const cta = { text: 'Explore Products', url: `${process.env.FRONTEND_URL || 'https://northtechhub.in'}/products` };
    const html = getEmailLayout(title, 'Onboarding Started', content, cta, '#3b82f6');
    return sendResendEmail(to, 'Welcome to North Tech Hub', html);
};

/**
 * Send password reset confirmation
 */
const sendPasswordResetConfirmation = async (to, name = 'User') => {
    const title = 'Password Reset Successful';
    const content = `
        <h2 style="margin: 0 0 16px 0; color: #0f172a; font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 600;">Hi ${name},</h2>
        <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">Your password has been successfully reset. You can now log back into your account using your new credentials.</p>
        
        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0; color: #065f46; font-size: 14px; font-weight: 500;">
            ✅ Account security updated successfully
        </div>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <h4 style="margin: 0 0 6px 0; color: #7f1d1d; font-size: 14px; font-weight: 600;">Didn't make this change?</h4>
            <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.5;">If you did not request a password reset, please secure your account by contacting our support team immediately.</p>
        </div>
    `;
    const cta = { text: 'Login to Account', url: `${process.env.FRONTEND_URL || 'https://northtechhub.in'}/login` };
    const html = getEmailLayout(title, 'Security Update', content, cta, '#10b981');
    return sendResendEmail(to, 'Password Reset Successful - North Tech Hub', html);
};

/**
 * Send order confirmation email
 */
const sendOrderConfirmationEmail = async (to, order, name = 'Customer') => {
    const title = 'Order Confirmed';
    
    // Format order items HTML
    const itemsHtml = order.orderItems.map(item => `
        <tr>
            <td style="padding: 14px 0; border-bottom: 1px solid #f1f5f9;">
                <div style="font-weight: 600; color: #0f172a; font-size: 14px;">${item.title}</div>
                <div style="color: #64748b; font-size: 12px; margin-top: 2px;">Quantity: ${item.quantity}</div>
            </td>
            <td style="padding: 14px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600; color: #0f172a; font-size: 14px;">
                ₹${(item.price * item.quantity).toFixed(2)}
            </td>
        </tr>
    `).join('');

    const content = `
        <h2 style="margin: 0 0 8px 0; color: #0f172a; font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 600;">Thank you for your order, ${name}!</h2>
        <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">We have received your order and are preparing it for shipment. Below is your order summary.</p>
        
        <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin: 24px 0; border: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Order Number</span>
            <div style="color: #0f172a; font-family: monospace; font-size: 18px; font-weight: 700; margin-top: 4px;">#${order._id.toString().slice(-8).toUpperCase()}</div>
        </div>
        
        <h3 style="color: #0f172a; font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 600; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin: 24px 0 12px 0;">Items Ordered</h3>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
            ${itemsHtml}
        </table>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px; font-size: 14px;">
            <tr>
                <td style="padding: 6px 0; color: #64748b;">Subtotal</td>
                <td style="padding: 6px 0; text-align: right; color: #0f172a; font-weight: 500;">₹${order.itemsPrice.toFixed(2)}</td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #64748b;">Shipping</td>
                <td style="padding: 6px 0; text-align: right; color: #0f172a; font-weight: 500;">${order.shippingPrice === 0 ? 'FREE' : '₹' + order.shippingPrice.toFixed(2)}</td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #64748b;">Tax (GST 10%)</td>
                <td style="padding: 6px 0; text-align: right; color: #0f172a; font-weight: 500;">₹${order.taxPrice.toFixed(2)}</td>
            </tr>
            ${order.discountPrice > 0 ? `
            <tr>
                <td style="padding: 6px 0; color: #10b981; font-weight: 500;">Discount</td>
                <td style="padding: 6px 0; text-align: right; color: #10b981; font-weight: 600;">-₹${order.discountPrice.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr>
                <td style="padding: 16px 0 0 0; border-top: 2px solid #e2e8f0; font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #0f172a;">Total</td>
                <td style="padding: 16px 0 0 0; border-top: 2px solid #e2e8f0; text-align: right; font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #10b981;">₹${order.totalPrice.toFixed(2)}</td>
            </tr>
        </table>
        
        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-top: 24px;">
            <h4 style="margin: 0 0 8px 0; color: #0f172a; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;">📍 Delivery Address</h4>
            <p style="margin: 0; color: #475569; font-size: 13px; line-height: 1.6;">
                <strong>${order.shippingAddress.fullName || name}</strong><br>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br>
                ${order.shippingAddress.country}
            </p>
        </div>
    `;
    const cta = { text: 'Track Order Details', url: `${process.env.FRONTEND_URL || 'https://northtechhub.in'}/orders/${order._id}` };
    const html = getEmailLayout(title, 'Receipt & Details', content, cta, '#10b981');
    return sendResendEmail(to, `Order Confirmed - #${order._id.toString().slice(-8).toUpperCase()}`, html);
};

/**
 * Send shipping update email
 */
const sendShippingUpdateEmail = async (to, order, name = 'Customer', trackingInfo = null) => {
    const title = 'Order Shipped';
    const content = `
        <h2 style="margin: 0 0 16px 0; color: #0f172a; font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 600;">Your Order is on its way, ${name}!</h2>
        <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">Your package has been handed over to our delivery partner. You can track your shipment using the tracking credentials below.</p>
        
        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 16px; padding: 24px; border: 1px solid #bfdbfe; margin: 24px 0;">
            <h3 style="margin: 0 0 12px 0; color: #1e3a8a; font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 600;">📍 Shipping & Delivery Info</h3>
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size: 14px; color: #1e40af;">
                <tr>
                    <td style="padding: 4px 0; width: 140px;"><strong>Order Reference:</strong></td>
                    <td style="padding: 4px 0;">#${order._id.toString().slice(-8).toUpperCase()}</td>
                </tr>
                ${trackingInfo ? `
                <tr>
                    <td style="padding: 4px 0;"><strong>Shipping Carrier:</strong></td>
                    <td style="padding: 4px 0;">${trackingInfo.carrier}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0;"><strong>Tracking Number:</strong></td>
                    <td style="padding: 4px 0;"><code style="background: white; padding: 2px 6px; border-radius: 4px; border: 1px solid #bfdbfe; font-family: monospace;">${trackingInfo.trackingNumber}</code></td>
                </tr>
                ` : ''}
            </table>
        </div>
    `;
    const cta = { text: 'Track Shipment Progress', url: trackingInfo?.trackingUrl || `${process.env.FRONTEND_URL || 'https://northtechhub.in'}/orders/${order._id}` };
    const html = getEmailLayout(title, 'Package Out for Delivery', content, cta, '#3b82f6');
    return sendResendEmail(to, `Your Order Has Been Shipped! - #${order._id.toString().slice(-8).toUpperCase()}`, html);
};

/**
 * Send course enrollment email
 */
const sendCourseEnrollmentEmail = async (to, course, name = 'User') => {
    const title = 'Course Enrollment Confirmed';
    const content = `
        <h2 style="margin: 0 0 16px 0; color: #0f172a; font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 600;">Let's start learning, ${name}!</h2>
        <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">You have successfully enrolled in <strong>${course.title}</strong>. Your curriculum and video streaming dashboard are now fully unlocked.</p>
        
        <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 16px; padding: 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 12px 0; color: #581c87; font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700;">${course.title}</h3>
            <p style="margin: 0 0 12px 0; color: #6b21a8; font-size: 14px; line-height: 1.5;">${course.description?.substring(0, 150) || 'Unlock your potential with this comprehensive program.'}...</p>
            <div style="font-size: 13px; color: #7c3aed; font-weight: 500;">
                <strong>Instructor:</strong> ${course.instructor || 'Expert Instructor'}
            </div>
        </div>
    `;
    const cta = { text: 'Start Learning Now', url: `${process.env.FRONTEND_URL || 'https://northtechhub.in'}/my-courses` };
    const html = getEmailLayout(title, 'Curriculum Activated', content, cta, '#8b5cf6');
    return sendResendEmail(to, `Enrolled in Course - ${course.title}`, html);
};

/**
 * Send password change notification email
 */
const sendPasswordChangeNotification = async (to, name = 'User') => {
    const title = 'Password Security Notice';
    const content = `
        <h2 style="margin: 0 0 16px 0; color: #0f172a; font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 600;">Hi ${name},</h2>
        <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">Your North Tech Hub account password was recently updated. If you made this change, you can safely ignore this alert.</p>
        
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 24px 0; font-size: 14px; color: #92400e; font-weight: 500;">
            🔐 Security Alert: Password update successful.
        </div>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <h4 style="margin: 0 0 6px 0; color: #7f1d1d; font-size: 14px; font-weight: 600;">Didn't make this change?</h4>
            <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.5;">If you did not execute this update, someone else might have accessed your account. Secure your credentials immediately.</p>
        </div>
    `;
    const cta = { text: 'Secure My Account', url: `${process.env.FRONTEND_URL || 'https://northtechhub.in'}/forgot-password` };
    const html = getEmailLayout(title, 'Password Updated', content, cta, '#f59e0b');
    return sendResendEmail(to, 'Account Password Changed - North Tech Hub', html);
};

/**
 * Send email verification link
 */
const sendVerificationEmail = async (to, verificationLink, name = 'User') => {
    const title = 'Verify Your Email Address';
    const content = `
        <h2 style="margin: 0 0 16px 0; color: #0f172a; font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 600;">Hi ${name},</h2>
        <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">Welcome to North Tech Hub! To finalize your registration and activate your account, please click the button below to verify your email address.</p>
        
        <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px;">This link is valid for <strong>24 hours</strong>. If the button doesn't work, copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; margin: 0 0 24px 0; font-size: 13px;"><a href="${verificationLink}" style="color: #6366f1; text-decoration: none;">${verificationLink}</a></p>
    `;
    const cta = { text: 'Verify Email Address', url: verificationLink };
    const html = getEmailLayout(title, 'Activate Account', content, cta, '#6366f1');
    return sendResendEmail(to, 'Verify Your Email - North Tech Hub', html);
};

/**
 * Send resend verification email (same template)
 */
const sendResendVerificationEmail = async (to, verificationLink, name = 'User') => {
    return sendVerificationEmail(to, verificationLink, name);
};

module.exports = {
    sendOTPEmail,
    sendWelcomeEmail,
    sendPasswordResetConfirmation,
    sendOrderConfirmationEmail,
    sendShippingUpdateEmail,
    sendCourseEnrollmentEmail,
    sendPasswordChangeNotification,
    sendVerificationEmail,
    sendResendVerificationEmail,
};
