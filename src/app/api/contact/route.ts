import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    await resend.emails.send({
      from: "Caspian Routes <onboarding@resend.dev>",
      to: "ealyarov55@gmail.com",
      subject: `✉️ Новое сообщение от ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#f0f4f4;font-family:Arial,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:#042e2e;border-radius:20px;overflow:hidden;">
            
            <div style="background:linear-gradient(135deg,#042e2e 0%,#0a7070 100%);padding:40px;text-align:center;">
              <p style="color:#2dd4bf;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;margin:0 0 12px;">Caspian Routes</p>
              <h1 style="color:white;font-size:26px;font-weight:300;margin:0;font-family:Georgia,serif;">Новое сообщение с сайта</h1>
            </div>

            <div style="padding:36px;">
              
              <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:20px;margin-bottom:20px;">
                <p style="color:#2dd4bf;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 6px;">Имя</p>
                <p style="color:white;font-size:15px;font-weight:600;margin:0;">${name}</p>
              </div>

              <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:20px;margin-bottom:20px;">
                <p style="color:#2dd4bf;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 6px;">Email</p>
                <p style="color:white;font-size:15px;margin:0;">${email}</p>
              </div>

              <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:20px;">
                <p style="color:#2dd4bf;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 6px;">Сообщение</p>
                <p style="color:rgba(255,255,255,0.8);font-size:15px;line-height:1.6;margin:0;">${message}</p>
              </div>

              <div style="text-align:center;margin-top:32px;">
                <a href="mailto:${email}" style="display:inline-block;background:linear-gradient(135deg,#0a7070,#0d9090);color:white;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:14px;font-weight:600;">
                  Ответить → ${email}
                </a>
              </div>

            </div>

            <div style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">caspian-routes.com · AI Travel Planner</p>
            </div>

          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}