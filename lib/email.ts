import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPaymentApprovalEmailParams {
  to: string;
  userName: string;
  amount: number;
  planName: string;
}

async function sendPaymentApprovalEmail({
  to,
  userName,
  amount,
  planName,
}: SendPaymentApprovalEmailParams) {
  try {
    const from = process.env.RESEND_FROM_EMAIL || 'Regal Investment <onboarding@resend.dev>';
    const amountFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://i.postimg.cc/bNychjPg/dark-logo.png" alt="Regal Investment" style="max-width: 200px; height: auto;" />
        </div>
        
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
          <h2 style="color: #72a210; margin-top: 0;">Payment Approved! 🎉</h2>
          
          <p>Hello ${userName},</p>
          
          <p>We're excited to inform you that your payment of <strong>${amountFormatted}</strong> for the <strong>${planName}</strong> plan has been successfully approved!</p>
          
          <div style="background-color: #e8f5e9; border-left: 4px solid #72a210; padding: 12px 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0;">
              <strong>Investment Details:</strong><br>
              Amount: ${amountFormatted}<br>
              Plan: ${planName}<br>
              Status: <span style="color: #2e7d32; font-weight: 500;">Approved</span>
            </p>
          </div>
          
          <p>Your investment is now active and will start earning returns according to your selected plan's terms.</p>
          
          <p>You can now log in to your dashboard to track your investment progress and manage your portfolio.</p>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <p>Happy Investing!<br>The Regal Investment Team</p>
        </div>
        
        <div style="text-align: center; color: #6c757d; font-size: 12px; margin-top: 30px;">
          <p>© ${new Date().getFullYear()} Regal Investment. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from,
      to,
      subject: `Payment Approved - ${amountFormatted} Investment`,
      html: emailHtml,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending payment approval email:', error);
    return { success: false, error };
  }
}

interface SendWithdrawalStatusUpdateParams {
  to: string;
  userName: string;
  amount: number;
  status: 'Approved' | 'Rejected';
  adminNote?: string | null;
  txHash?: string | null;
  crypto?: string;
}

async function sendWithdrawalStatusUpdate({
  to,
  userName,
  amount,
  status,
  adminNote,
  txHash,
  crypto = 'USDT'
}: SendWithdrawalStatusUpdateParams) {
  try {
    const from = process.env.RESEND_FROM_EMAIL || 'Regal Investment <onboarding@resend.dev>';
    const amountFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

    const statusText = status === 'Approved' ? 'Approved' : 'Rejected';
    const statusColor = status === 'Approved' ? '#10B981' : '#EF4444';
    const statusIcon = status === 'Approved' ? '✅' : '❌';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://i.postimg.cc/bNychjPg/dark-logo.png" alt="Regal Investment" style="max-width: 200px; height: auto;" />
        </div>
        
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
          <h2 style="color: ${statusColor}; margin-top: 0;">Withdrawal Request ${statusText} ${statusIcon}</h2>
          
          <p>Hello ${userName},</p>
          
          <p>Your withdrawal request has been <strong>${statusText.toLowerCase()}</strong> by our team.</p>
          
          <div style="background-color: #e8f5e9; border-left: 4px solid ${statusColor}; padding: 12px 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0;">
              <strong>Withdrawal Details:</strong><br>
              Amount: ${amountFormatted} ${crypto}<br>
              Status: <span style="color: ${statusColor}; font-weight: 500;">${statusText}</span><br>
              ${txHash ? `Transaction Hash: <span style="font-family: monospace;">${txHash}</span><br>` : ''}
              ${adminNote ? `Admin Note: ${adminNote}<br>` : ''}
              Date: ${new Date().toLocaleDateString()}
            </p>
          </div>
          
          ${status === 'Approved' ? 
            `<p>Your funds have been processed and should be available in your wallet shortly. If you don't see the transaction, please check the blockchain explorer for the transaction hash provided above.</p>` :
            `<p>If you have any questions about this decision, please contact our support team for more information.</p>`
          }
          
          <p>Best regards,<br>The Regal Investment Team</p>
        </div>
        
        <div style="text-align: center; color: #6c757d; font-size: 12px; margin-top: 30px;">
          <p> ${new Date().getFullYear()} Regal Investment. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from,
      to,
      subject: `Withdrawal ${statusText} - ${amountFormatted} ${crypto}`,
      html: emailHtml,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending withdrawal status email:', error);
    return { success: false, error };
  }
}

// Export all functions and types
export type { SendPaymentApprovalEmailParams, SendWithdrawalStatusUpdateParams };
export { sendPaymentApprovalEmail, sendWithdrawalStatusUpdate };
