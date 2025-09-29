const crypto = require('crypto');

const verifyRazorpayWebhook = (req, res, next) => {
  try {
    const razorpaySignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not set');
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error' 
      });
    }
    
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (razorpaySignature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid webhook signature' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Webhook verification error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Webhook verification failed' 
    });
  }
};

module.exports = verifyRazorpayWebhook;
