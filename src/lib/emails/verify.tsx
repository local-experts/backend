import { Resend } from "resend";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const VerifyEmail = ({
  otp,
  userEmail,
}: {
  otp: string;
  userEmail: string;
}) => (
  <Html>
    <Head />
    <Preview>Your verification code for Local</Preview>
    <Tailwind>
      <Body className="bg-white my-auto mx-auto font-sans">
        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
          <Section className="mt-[32px]">
            {/* You can replace this with your actual logo */}
            <Img
              src="https://via.placeholder.com/40x37"
              width="40"
              height="37"
              alt="Local"
              className="my-0 mx-auto"
            />
          </Section>
          <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
            Verify your email address
          </Heading>
          <Text className="text-black text-[14px] leading-[24px]">
            Here is your one-time password to complete your registration:
          </Text>
          <Section className="text-center mt-[32px] mb-[32px]">
            <Text className="text-black text-[32px] font-bold tracking-widest">
              {otp}
            </Text>
          </Section>
          <Text className="text-black text-[14px] leading-[24px]">
            This code will expire in 10 minutes.
          </Text>
          <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          <Text className="text-[#666666] text-[12px] leading-[24px]">
            This email was intended for{" "}
            <span className="text-black">{userEmail}</span>. If you did not
            request this code, you can ignore this email. If you are concerned
            about your account's safety, please send an email to
            support@localexperts.app to get in touch with us.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

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
      from: "Verification <verify@localexperts.app>",
      to: userEmail,
      subject: "Verify your email address",
      react: <VerifyEmail otp={otp} userEmail={userEmail} />,
    });

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Detailed error sending email:", error);
  }
}
