import React from "react";
export default function PolicyContent({ activePolicy }) {
    const policyData = {
        returns: {
          id: "policies",
          title: "Return & Refund Policy",
          updated: "At Gamya Collections, we ensure high-quality products and secure packaging. Please read our return and refund policy carefully before making a purchase.",
          content: [
            {
              heading: "1. No Returns or Exchanges",
              text: "We do not offer returns, exchanges, or cancellations for reasons such as change of mind after purchase, the product not suiting personal preference, incorrect orders placed by the customer, size concerns related to bangles or motif width, delays in courier delivery, or the order arriving after a planned event.",
            },
            {
              heading: "2. Damaged or Defective Products",
              text: "We only replace items that are damaged or broken during transit. Please follow these steps to initiate a replacement:\n\n- A complete unboxing video (without cuts) from the moment of opening the outer packaging is mandatory for any damage claims.\n- Contact us on WhatsApp at 9137742517 within 3 days of delivery with the unboxing video and order details.\n- Once approved, the damaged item must be shipped back within 48 hours, and the tracking ID must be shared.\n\nNote: Minor issues like unstuck stones are not considered defects, as they can be fixed using fabric glue.",
            },
            {
              heading: "3. Refund Policy",
              text: "Refunds are only issued if the replacement product is unavailable. If a refund is approved, it will be processed using the original payment method within 5-7 business days.",
            },
            {
              heading: "4. Shipping & Return Process",
              text: "Customers must manually ship the item back, as we do not offer reverse pickup. If the issue is from our end, we will cover the return shipping charges. However, the customer will be responsible for the cost of reshipping the replacement product.",
            },
            {
              heading: "5. Final Decision",
              text: "All return and refund approvals are at the sole discretion of Gamya Collections. We ensure every package is checked and packed securely to minimize damages.",
            },
            {
              heading: "For further assistance",
              text: "Contact us on WhatsApp: 9137742517.",
            },
          ],
        },
        shipping: {
          id: "shipping",
          title: "Shipping Policy – Gamya Collections",
          updated: "At Gamya Collections, we are committed to ensuring that your order reaches you in the best condition and within the estimated delivery time. Please read our shipping policy carefully before placing your order.",
          content: [
            {
              heading: "1. Free Shipping",
              text: "We offer free shipping on all prepaid orders placed on our website. Cash on Delivery (COD) is not available; all orders must be prepaid at checkout.",
            },
            {
              heading: "2. Processing & Delivery Time",
              text: "Orders are processed within 1-3 business days after payment confirmation. The estimated delivery time is 5 to 10 business days, depending on the shipping location and courier service. Sundays and public holidays are not considered as working days for shipping. In case of delays due to unforeseen circumstances such as weather conditions, courier disruptions, or high order volumes, we will keep you updated.",
            },
            {
              heading: "3. Order Packaging & Receiving Guidelines",
              text: "All orders are shipped in tamper-proof packaging to ensure the safety of your products. Upon delivery, please check the package before accepting it. If you notice any signs of tampering, kindly reject the package and inform us immediately.",
            },
            {
              heading: "4. Tracking Your Order",
              text: "Once shipped, you will receive a tracking ID via email or WhatsApp. Customers are responsible for tracking their orders and ensuring someone is available to receive the package at the provided address.",
            },
            {
              heading: "5. Address & Delivery Issues",
              text: "Please ensure that the shipping address and contact details are accurate while placing the order. If an order is returned due to an incorrect address or failed delivery attempts, the reshipping charges must be paid by the customer. The courier company will attempt delivery 2-3 times. If the delivery is unsuccessful, the package may be held at the courier office for pickup or returned to us.",
            },
            {
              heading: "6. Lost, Delayed, or Damaged Shipments",
              text: "We take extreme care in packaging, but if your package arrives damaged, record an unboxing video (without cuts) and contact us within 3 days for assistance. Gamya Collections is not responsible for lost or stolen packages after they have been marked as delivered by the courier.",
            },
            {
              heading: "7. International Shipping",
              text: "Currently, we do not offer international shipping. For any queries related to shipping, please contact us via WhatsApp at 9137742517.",
            },
          ],
        },
        terms: {
          title: "Terms of Service",
          updated: "Please read these terms carefully before using our website.",
          content: [
            {
              heading: "1. Acceptance of Terms",
              text: "By accessing and using the Gamya Collections website, you agree to these terms. If you do not agree, please refrain from using the site.",
            },
            {
              heading: "2. Use of Content",
              text: "All content on this website is for personal, non-commercial use only. You may not copy, modify, distribute, or use any content without prior permission.",
            },
            {
              heading: "3. Product Information",
              text: "We strive to provide accurate product details, including dimensions, colors, and materials. However, variations may occur due to photography or screen settings. Please verify any details before purchasing, as we do not offer exchanges or replacements based on these factors.",
            },
            {
              heading: "4. Accuracy of Materials",
              text: "While we aim to keep our website information accurate and up to date, errors may occur. Gamya Collections does not guarantee the completeness or correctness of any content. Information may change without notice.",
            },
            {
              heading: "5. User Responsibilities",
              text: "Users must not engage in fraudulent transactions, misuse the website, or attempt unauthorized access. Any violation may result in the termination of access to our services.",
            },
            {
              heading: "6. Limitation of Liability",
              text: "Gamya Collections is not liable for any direct, indirect, incidental, or consequential damages resulting from the use of our website or products.",
            },
            {
              heading: "7. Changes to Terms",
              text: "Gamya Collections reserves the right to modify these terms at any time without prior notice. Continued use of the website constitutes acceptance of the updated terms.",
            },
            {
              heading: "For any queries",
              text: "Please contact our support team.",
            },
          ],
        },
        privacy:{
            title: "Privacy Policy",
            updated: "Gamya Collections is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our website.",
            content: [
              {
                heading: "1. Introduction",
                text: "Gamya Collections is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our website.",
              },
              {
                heading: "2. Information We Collect",
                text: "We may collect the following information when you interact with our website:\n\n- Personal details (name, contact number, email, shipping address) provided during purchase.\n- Payment details processed securely via third-party payment gateways.\n- Website usage data, including cookies and browsing behavior, to enhance user experience.",
              },
              {
                heading: "3. How We Use Your Information",
                text: "We use your information for the following purposes:\n\n- To process and fulfill orders, including delivery updates.\n- To communicate important information, including promotions, order confirmations, and customer support.\n- To improve our website, services, and user experience.\n- To comply with legal and regulatory requirements.",
              },
              {
                heading: "4. Data Protection and Security",
                text: "We take reasonable measures to protect your data from unauthorized access, disclosure, or misuse. However, no online platform is 100% secure, and we encourage users to take precautions when sharing personal information online.",
              },
              {
                heading: "5. Third-Party Sharing",
                text: "We do not sell, trade, or rent your personal information. However, we may share necessary details with:\n\n- Trusted service providers (e.g., delivery partners, payment processors) to complete your transactions.\n- Legal authorities if required by law or to protect our rights.",
              },
              {
                heading: "6. Cookies and Tracking Technologies",
                text: "Our website uses cookies to enhance user experience and analyze site traffic. You can manage your cookie preferences through your browser settings.",
              },
              {
                heading: "7. Your Rights",
                text: "You have the right to:\n\n- Access, correct, or request deletion of your personal data.\n- Opt out of marketing communications at any time.\n- Withdraw consent where applicable.",
              },
              {
                heading: "8. Changes to This Policy",
                text: "We may update this Privacy Policy from time to time. Changes will be posted on this page, and continued use of our services implies acceptance of the updated policy.",
              },
              {
                heading: "9. Contact Us",
                text: "For any privacy-related concerns or requests, please contact us.",
              },
            ],
        }
      };

  const policy = policyData[activePolicy];

  return (
    <div className="flex-1 p-6 md:p-10 overflow-auto h-screen hide-scrollbar"> {/* Added hide-scrollbar class */}
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-medium text-gray-700 mb-1">{policy?.title}</h1>
        <p className="text-sm text-gray-400 mb-6">{policy?.updated}</p>
  
        <div className="space-y-6">
          {policy?.content.map((section, index) => (
            <div key={index}>
              {section?.heading && <h2 className="text-lg font-medium text-gray-600 mb-2">{section?.heading}</h2>}
              <p className="text-gray-600 leading-relaxed">{section?.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}