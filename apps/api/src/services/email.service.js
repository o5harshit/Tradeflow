export const sendVerificationEmail = async (email, otp) => {
  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: process.env.BREVO_SENDER_NAME,
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email }],
        subject: "Verify your TradeFlow email",
        textContent:
          `Your TradeFlow verification code is ${otp}. ` +
          "It expires in 5 minutes. Do not share this code.",
      }),
    }
  );

  if (!response.ok) {
    const details = await response.text();

    console.error("Brevo email request failed:", details);

    const error = new Error("Unable to send verification email");
    error.statusCode = 502;
    throw error;
  }
};