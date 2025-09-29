const Order = require('../models/Order');
const shiprocketService = require('../services/shiprocketService');
const { sendOrderConfirmationToUser, sendNewOrderNotificationToAdmin } = require('../services/emailService');

// Handle successful payment from webhook
exports.handleSuccessfulPayment = async (payment) => {
  try {
    console.log(`Processing successful payment: ${payment.id}`);
    
    // Find order by Razorpay order ID
    const order = await Order.findOne({ razorpayOrderId: payment.order_id });
    
    if (!order) {
      console.error(`Order not found for payment: ${payment.id}`);
      return;
    }
    
    // Update order status if not already updated
    if (order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      order.paymentDetails = payment;
      order.orderStatus = 'processing';
      await order.save();
      
      // Trigger Shiprocket order creation
      await createShiprocketOrder(order);
    }
    
  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
};

// Create Shiprocket order
const createShiprocketOrder = async (order) => {
  try {
    const shiprocketOrderData = {
      order_id: order.orderId,
      order_date: order.createdAt.toISOString(),
      billing_customer_name: order.address.fullName,
      billing_address: order.address.addressLine1,
      billing_address_2: order.address.addressLine2 || '',
      billing_city: order.address.city,
      billing_pincode: order.address.pincode,
      billing_state: order.address.state,
      billing_country: 'India',
      billing_email: order.userEmail,
      billing_phone: order.address.phone,
      shipping_is_billing: true,
      order_items: order.items.map(item => ({
        name: item.productName,
        sku: `SKU_${item.productId}`,
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
        tax: 0,
        hsn: 0
      })),
      payment_method: 'Prepaid',
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: order.totalAmount,
      length: 10,
      breadth: 10,
      height: 5,
      weight: 0.5
    };

    const shiprocketResponse = await shiprocketService.createOrder(shiprocketOrderData);
    console.log('Shiprocket order created:', shiprocketResponse);
    
    // Update order with Shiprocket details
    order.shiprocketOrderId = shiprocketResponse.order_id;
    order.shiprocketShipmentId = shiprocketResponse.shipment_id;
    order.orderStatus = 'confirmed';
    await order.save();
    
    // Send confirmation emails
    await sendOrderConfirmationToUser(order);
    await sendNewOrderNotificationToAdmin(order);
    
    return shiprocketResponse;
  } catch (error) {
    console.error('Shiprocket order creation failed:', error);
    // Update order with error details
    order.notes = `Shiprocket error: ${error.message}`;
    order.orderStatus = 'needs_review';
    await order.save();
    throw error;
  }
};

// Handle failed payment from webhook
exports.handleFailedPayment = async (payment) => {
  try {
    console.log(`Processing failed payment: ${payment.id}`);
    
    await Order.findOneAndUpdate(
      { razorpayOrderId: payment.order_id },
      { 
        paymentStatus: 'failed',
        orderStatus: 'cancelled',
        paymentError: payment.error_description || 'Payment failed',
        paymentDetails: payment
      }
    );
    
  } catch (error) {
    console.error('Error handling failed payment:', error);
    throw error;
  }
};

// Handle paid order from webhook
exports.handleOrderPaid = async (order) => {
  try {
    console.log(`Processing paid order: ${order.id}`);
    
    // Find and update order
    const updatedOrder = await Order.findOneAndUpdate(
      { razorpayOrderId: order.id },
      { 
        paymentStatus: 'paid',
        orderStatus: 'processing',
        paymentDetails: order
      },
      { new: true }
    );
    
    if (updatedOrder) {
      // Trigger Shiprocket order creation
      await createShiprocketOrder(updatedOrder);
    }
    
  } catch (error) {
    console.error('Error handling paid order:', error);
    throw error;
  }
};

// Webhook handler for Razorpay
exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const { event, payload } = req.body;
    console.log(`Razorpay webhook received: ${event}`);
    
    switch (event) {
      case 'payment.captured':
        await this.handleSuccessfulPayment(payload.payment.entity);
        break;
      case 'payment.failed':
        await this.handleFailedPayment(payload.payment.entity);
        break;
      case 'order.paid':
        await this.handleOrderPaid(payload.order.entity);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};
