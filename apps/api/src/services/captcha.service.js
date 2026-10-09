const TURNSTILE_URL = process.env.TURNSTILE_URL;

export const verifyCaptcha = async (token, remoteIp) => {
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(TURNSTILE_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: remoteIp,
      }),
    });

    const result = await response.json();

    return result.success === true;
  } catch (error) {
    console.error("CAPTCHA verification failed:", error);

    return false;
  }
};