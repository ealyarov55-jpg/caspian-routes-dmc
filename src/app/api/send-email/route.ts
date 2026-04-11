import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, booking } = body;

    if (type === "booking_created") {
      await resend.emails.send({
        from: "Caspian Routes <onboarding@resend.dev>",
        to: "ealyarov55@gmail.com",
        subject: `New Booking Request from ${booking.clientName}`,
        html: providerEmailTemplate(booking),
      });

      await resend.emails.send({
        from: "Caspian Routes <onboarding@resend.dev>",
        to: "ealyarov55@gmail.com",
        subject: `Booking Confirmation - ${booking.routeName}`,
        html: clientEmailTemplate(booking),
      });
    }

    if (type === "booking_confirmed") {
      await resend.emails.send({
        from: "Caspian Routes <onboarding@resend.dev>",
        to: "ealyarov55@gmail.com",
        subject: `✅ Your Booking is Confirmed! - ${booking.routeName}`,
        html: confirmationEmailTemplate(booking),
      });
    }

    if (type === "booking_cancelled") {
      await resend.emails.send({
        from: "Caspian Routes <onboarding@resend.dev>",
        to: "ealyarov55@gmail.com",
        subject: `Booking Update - ${booking.routeName}`,
        html: cancellationEmailTemplate(booking),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

function providerEmailTemplate(booking: any) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f0f7f7;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(4,46,46,0.1);">
        <div style="background:linear-gradient(135deg,#021a1a 0%,#065050 100%);padding:40px;text-align:center;">
          <h1 style="color:white;font-size:28px;font-weight:300;margin:0 0 8px;font-family:Georgia,serif;">New Booking Request 🗺️</h1>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0;">You have a new booking request on Caspian Routes</p>
        </div>
        <div style="padding:40px;">
          <p style="color:#4a6060;font-size:16px;margin:0 0 24px;">Hello <strong style="color:#021a1a;">${booking.providerName}</strong>,</p>
          <p style="color:#4a6060;font-size:15px;line-height:1.6;margin:0 0 32px;">You have received a new booking request. Please review and confirm or decline.</p>
          <div style="background:#f8fafa;border-radius:16px;padding:24px;margin-bottom:24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#94a3a3;font-size:13px;width:40%;">Tourist</td><td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.clientName}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3a3;font-size:13px;">Email</td><td style="padding:8px 0;color:#021a1a;font-size:13px;">${booking.clientEmail}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3a3;font-size:13px;">Route</td><td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.routeName || "Custom Tour"}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3a3;font-size:13px;">Date</td><td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.date}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3a3;font-size:13px;">Guests</td><td style="padding:8px 0;color:#021a1a;font-size:13px;">${booking.guests} person(s)</td></tr>
            </table>
          </div>
          <div style="text-align:center;">
            <a href="https://caspian-routes.vercel.app/en/provider/requests" style="display:inline-block;background:linear-gradient(135deg,#0a7070,#0d9090);color:white;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:15px;font-weight:600;">View Booking Request →</a>
          </div>
        </div>
        <div style="background:#f8fafa;padding:24px 40px;text-align:center;border-top:1px solid #e2eded;">
          <p style="color:#94a3a3;font-size:12px;margin:0;">Caspian Routes DMC · Azerbaijan Travel Platform</p>
        </div>
      </div>
    </body></html>`;
}

function clientEmailTemplate(booking: any) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f0f7f7;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(4,46,46,0.1);">
        <div style="background:linear-gradient(135deg,#021a1a 0%,#065050 100%);padding:40px;text-align:center;">
          <h1 style="color:white;font-size:28px;font-weight:300;margin:0 0 8px;font-family:Georgia,serif;">Booking Request Sent! 🎉</h1>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0;">Your request has been sent to your guide</p>
        </div>
        <div style="padding:40px;">
          <p style="color:#4a6060;font-size:16px;margin:0 0 24px;">Hello <strong style="color:#021a1a;">${booking.clientName}</strong>,</p>
          <p style="color:#4a6060;font-size:15px;line-height:1.6;margin:0 0 32px;">Your booking request has been sent to <strong>${booking.providerName}</strong>. They will contact you soon.</p>
          <div style="background:#f8fafa;border-radius:16px;padding:24px;margin-bottom:32px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#94a3a3;font-size:13px;width:40%;">Guide</td><td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.providerName}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3a3;font-size:13px;">Route</td><td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.routeName || "Custom Tour"}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3a3;font-size:13px;">Date</td><td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.date}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3a3;font-size:13px;">Guests</td><td style="padding:8px 0;color:#021a1a;font-size:13px;">${booking.guests} person(s)</td></tr>
            </table>
          </div>
          <div style="text-align:center;">
            <a href="https://caspian-routes.vercel.app/en/bookings" style="display:inline-block;background:linear-gradient(135deg,#0a7070,#0d9090);color:white;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:15px;font-weight:600;">View My Bookings →</a>
          </div>
        </div>
        <div style="background:#f8fafa;padding:24px 40px;text-align:center;border-top:1px solid #e2eded;">
          <p style="color:#94a3a3;font-size:12px;margin:0;">Caspian Routes DMC · Azerbaijan Travel Platform</p>
        </div>
      </div>
    </body></html>`;
}

function confirmationEmailTemplate(booking: any) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f0f7f7;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(4,46,46,0.1);">
        <div style="background:linear-gradient(135deg,#042e2e 0%,#0a7070 100%);padding:40px;text-align:center;">
          <h1 style="color:white;font-size:28px;font-weight:300;margin:0 0 8px;font-family:Georgia,serif;">Booking Confirmed! ✅</h1>
        </div>
        <div style="padding:40px;">
          <p style="color:#4a6060;font-size:16px;margin:0 0 16px;">Hello <strong>${booking.clientName}</strong>,</p>
          <p style="color:#4a6060;font-size:15px;line-height:1.6;margin:0 0 32px;"><strong>${booking.providerName}</strong> has confirmed your booking for <strong>${booking.date}</strong>!</p>
          <div style="text-align:center;">
            <a href="https://caspian-routes.vercel.app/en/bookings" style="display:inline-block;background:linear-gradient(135deg,#0a7070,#0d9090);color:white;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:15px;font-weight:600;">View My Bookings →</a>
          </div>
        </div>
        <div style="background:#f8fafa;padding:24px 40px;text-align:center;border-top:1px solid #e2eded;">
          <p style="color:#94a3a3;font-size:12px;margin:0;">Caspian Routes DMC · Azerbaijan Travel Platform</p>
        </div>
      </div>
    </body></html>`;
}

function cancellationEmailTemplate(booking: any) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f0f7f7;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(4,46,46,0.1);">
        <div style="background:linear-gradient(135deg,#1a0202 0%,#500606 100%);padding:40px;text-align:center;">
          <h1 style="color:white;font-size:28px;font-weight:300;margin:0;font-family:Georgia,serif;">Booking Update</h1>
        </div>
        <div style="padding:40px;">
          <p style="color:#4a6060;font-size:16px;margin:0 0 16px;">Hello <strong>${booking.clientName}</strong>,</p>
          <p style="color:#4a6060;font-size:15px;line-height:1.6;margin:0 0 32px;"><strong>${booking.providerName}</strong> was unable to confirm your booking for <strong>${booking.date}</strong>. Please try another guide.</p>
          <div style="text-align:center;">
            <a href="https://caspian-routes.vercel.app/en/routes" style="display:inline-block;background:linear-gradient(135deg,#0a7070,#0d9090);color:white;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:15px;font-weight:600;">Find Another Guide →</a>
          </div>
        </div>
        <div style="background:#f8fafa;padding:24px 40px;text-align:center;border-top:1px solid #e2eded;">
          <p style="color:#94a3a3;font-size:12px;margin:0;">Caspian Routes DMC · Azerbaijan Travel Platform</p>
        </div>
      </div>
    </body></html>`;
}