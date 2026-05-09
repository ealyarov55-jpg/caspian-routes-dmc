import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    await resend.emails.send({
      from: "Caspian Routes <onboarding@resend.dev>",
      to: "ealyarov55@gmail.com",
      subject: `Новое сообщение от ${name} — Caspian Routes`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #f0f7f7; border-radius: 16px;">
          <h2 style="color: #021a1a; margin-bottom: 24px;">Новое сообщение с сайта</h2>
          <p><strong>Имя:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Сообщение:</strong></p>
          <p style="background: white; padding: 16px; border-radius: 8px; color: #4a6060;">${message}</p>
          <p style="color: #94a3a3; font-size: 12px; margin-top: 24px;">Caspian Routes · caspian-routes.com</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}