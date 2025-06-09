import { Resend } from "resend";

export async function sendVerificationEmail({
  userEmail,
  otp,
}: {
  userEmail: string;
  otp: string;
}) {
  const resend = new Resend(Bun.env.RESEND_API_KEY);

  console.log("called verification email");
  try {
    const response = await resend.emails.send({
      from: "Verification <emails@localexperts.app>",
      to: userEmail,
      subject: "Verify your email address",
      html: `<div>
        <h1>Verify your email address</h1>
        <p>Your verification code is <b>${otp}</b></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this verification, please ignore this email.</p>
      </div>`,
    });

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Detailed error sending email:", error);
  }
}
