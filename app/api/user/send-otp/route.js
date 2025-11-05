import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await User.findOneAndUpdate(
      { email },
      { otpCode: otp, otpExpiresAt: expiresAt, isVerified: false },
      { new: true }
    );

    if (!user) {
      user = await User.create({ email, otpCode: otp, otpExpiresAt: expiresAt, isVerified: false });
    }

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

    const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";

    const info = await transporter.sendMail({
      from,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is ${otp}. It expires in 10 minutes.`,
      html: `<p>Your verification code is <b>${otp}</b>. It expires in 10 minutes.</p>`,
    });

    const previewUrl = usingTestAccount ? nodemailer.getTestMessageUrl(info) : undefined;
    return new Response(JSON.stringify({ success: true, previewUrl }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to send OTP" }), { status: 500 });
  }
}
