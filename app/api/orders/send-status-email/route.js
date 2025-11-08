import dbConnect from "../../utils/dbConnect"
import Order from "../../models/Order"
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await dbConnect();
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return new Response(JSON.stringify({ error: "Order ID and status are required" }), { status: 400 });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    // Only send email for Shipped or Delivered status
    if (status !== "Shipped" && status !== "Delivered") {
      return new Response(JSON.stringify({ success: true, message: "Email not required for this status" }), { status: 200 });
    }

    // Setup email transporter
    let transporter;
    let usingTestAccount = false;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Boolean(process.env.SMTP_SECURE === "true"),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      usingTestAccount = true;
    }

    const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@hapttitudebooks.com";

    // Prepare email content
    const statusMessages = {
      Shipped: {
        subject: `Your Order #${order.orderId} has been Shipped!`,
        message: `Great news! Your order #${order.orderId} has been shipped and is on its way to you.`,
      },
      Delivered: {
        subject: `Your Order #${order.orderId} has been Delivered!`,
        message: `Your order #${order.orderId} has been successfully delivered. Thank you for shopping with us!`,
      },
    };

    const emailContent = statusMessages[status];
    if (!emailContent) {
      return new Response(JSON.stringify({ error: "Invalid status for email" }), { status: 400 });
    }

    const itemsList = order.items.map(item => 
      `- ${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`
    ).join("\n");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2f6d4c;">${emailContent.subject}</h2>
        <p>Dear ${order.address?.fullName || "Customer"},</p>
        <p>${emailContent.message}</p>
        <div style="background-color: #f8fdf9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f3b2c; margin-top: 0;">Order Details:</h3>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Items:</strong></p>
          <pre style="margin: 0; white-space: pre-wrap;">${itemsList}</pre>
          <p><strong>Total Amount:</strong> ₹${order.total}</p>
          <p><strong>Delivery Address:</strong></p>
          <p>${order.address?.fullName || ""}<br>
          ${order.address?.houseFlatNo || ""}, ${order.address?.areaLocality || ""}<br>
          ${order.address?.city || ""}, ${order.address?.state || ""} - ${order.address?.pincode || ""}</p>
        </div>
        <p>Thank you for choosing Hapttitude Books!</p>
        <p style="color: #3b4a3f; font-size: 12px; margin-top: 30px;">
          If you have any questions, please contact our support team.
        </p>
      </div>
    `;

    const textContent = `
${emailContent.subject}

Dear ${order.address?.fullName || "Customer"},

${emailContent.message}

Order Details:
Order ID: ${order.orderId}
Items:
${itemsList}
Total Amount: ₹${order.total}

Delivery Address:
${order.address?.fullName || ""}
${order.address?.houseFlatNo || ""}, ${order.address?.areaLocality || ""}
${order.address?.city || ""}, ${order.address?.state || ""} - ${order.address?.pincode || ""}

Thank you for choosing Hapttitude Books!
    `;

    const info = await transporter.sendMail({
      from,
      to: order.email,
      subject: emailContent.subject,
      text: textContent,
      html: htmlContent,
    });

    const previewUrl = usingTestAccount ? nodemailer.getTestMessageUrl(info) : undefined;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        previewUrl 
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending status email:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500 });
  }
}






