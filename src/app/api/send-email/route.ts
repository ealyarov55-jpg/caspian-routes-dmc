import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, booking } = body;

    if (type === "booking_created") {
      // Email to provider
      await resend.emails.send({
        from: "Caspian Routes <onboarding@resend.dev>",
        to: booking.providerEmail,
        subject: `New Booking Request from ${booking.clientName}`,
        html: providerEmailTemplate(booking),
      });

      // Email to client
      await resend.emails.send({
        from: "Caspian Routes <onboarding@resend.dev>",
        to: booking.clientEmail,
        subject: `Booking Confirmation - ${booking.routeName}`,
        html: clientEmailTemplate(booking),
      });
    }

    if (type === "booking_confirmed") {
      await resend.emails.send({
        from: "Caspian Routes <onboarding@resend.dev>",
        to: booking.clientEmail,
        subject: `✅ Your Booking is Confirmed! - ${booking.routeName}`,
        html: confirmationEmailTemplate(booking),
      });
    }

    if (type === "booking_cancelled") {
      await resend.emails.send({
        from: "Caspian Routes <onboarding@resend.dev>",
        to: booking.clientEmail,
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
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f0f7f7;font-family:'DM Sans',Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(4,46,46,0.1);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#021a1a 0%,#065050 100%);padding:40px 40px 32px;text-align:center;">
          <div style="width:56px;height:56px;background:rgba(45,212,191,0.2);border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:24px;">🗺️</span>
          </div>
          <h1 style="color:white;font-size:28px;font-weight:300;margin:0 0 8px;font-family:Georgia,serif;">New Booking Request</h1>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0;">You have a new booking request on Caspian Routes</p>
        </div>

        <!-- Content -->
        <div style="padding:40px;">
          <p style="color:#4a6060;font-size:16px;margin:0 0 24px;">Hello <strong style="color:#021a1a;">${booking.providerName}</strong>,</p>
          <p style="color:#4a6060;font-size:15px;line-height:1.6;margin:0 0 32px;">
            You have received a new booking request. Please review the details below and confirm or decline.
          </p>

          <!-- Booking Details -->
          <div style="background:#f8fafa;border-radius:16px;padding:24px;margin-bottom:24px;">
            <h3 style="color:#021a1a;font-size:16px;margin:0 0 16px;font-family:Georgia,serif;">Booking Details</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:#94a3a3;font-size:13px;width:40%;">Tourist</td>
                <td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.clientName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#94a3a3;font-size:13px;">Email</td>
                <td style="padding:8px 0;color:#021a1a;font-size:13px;">${booking.clientEmail}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#94a3a3;font-size:13px;">Route</td>
                <td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.routeName || "Custom Tour"}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#94a3a3;font-size:13px;">Date</td>
                <td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.date}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#94a3a3;font-size:13px;">Guests</td>
                <td style="padding:8px 0;color:#021a1a;font-size:13px;">${booking.guests} person${booking.guests !== 1 ? "s" : ""}</td>
              </tr>
              ${booking.message ? `
              <tr>
                <td style="padding:8px 0;color:#94a3a3;font-size:13px;vertical-align:top;">Message</td>
                <td style="padding:8px 0;color:#4a6060;font-size:13px;font-style:italic;">"${booking.message}"</td>
              </tr>` : ""}
            </table>
          </div>

          <!-- Earnings -->
          ${booking.pricePerDay ? `
          <div style="background:rgba(10,112,112,0.06);border:1px solid rgba(10,112,112,0.15);border-radius:12px;padding:16px 20px;margin-bottom:32px;display:flex;justify-content:space-between;align-items:center;">
            <span style="color:#065050;font-size:14px;">Estimated Earnings</span>
            <span style="color:#021a1a;font-size:24px;font-weight:700;font-family:Georgia,serif;">$${Number(booking.pricePerDay) * booking.guests}</span>
          </div>` : ""}

          <!-- CTA -->
          <div style="text-align:center;">
            <a href="https://caspian-routes.vercel.app/en/provider/requests" 
               style="display:inline-block;background:linear-gradient(135deg,#0a7070,#0d9090);color:white;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:15px;font-weight:600;box-shadow:0 8px 24px rgba(10,112,112,0.3);">
              View Booking Request →
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#f8fafa;padding:24px 40px;text-align:center;border-top:1px solid #e2eded;">
          <p style="color:#94a3a3;font-size:12px;margin:0;">Caspian Routes DMC · Azerbaijan Travel Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function clientEmailTemplate(booking: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f0f7f7;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(4,46,46,0.1);">
        
        <div style="background:linear-gradient(135deg,#021a1a 0%,#065050 100%);padding:40px;text-align:center;">
          <h1 style="color:white;font-size:28px;font-weight:300;margin:0 0 8px;font-family:Georgia,serif;">Booking Request Sent! 🎉</h1>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0;">Your request has been sent to your guide</p>
        </div>

        <div style="padding:40px;">
          <p style="color:#4a6060;font-size:16px;margin:0 0 24px;">Hello <strong style="color:#021a1a;">${booking.clientName}</strong>,</p>
          <p style="color:#4a6060;font-size:15px;line-height:1.6;margin:0 0 32px;">
            Your booking request has been successfully sent to <strong>${booking.providerName}</strong>. 
            They will review your request and contact you soon to confirm.
          </p>

          <div style="background:#f8fafa;border-radius:16px;padding:24px;margin-bottom:32px;">
            <h3 style="color:#021a1a;font-size:16px;margin:0 0 16px;font-family:Georgia,serif;">Your Booking Summary</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:#94a3a3;font-size:13px;width:40%;">Guide</td>
                <td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.providerName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#94a3a3;font-size:13px;">Route</td>
                <td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.routeName || "Custom Tour"}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#94a3a3;font-size:13px;">Date</td>
                <td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.date}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#94a3a3;font-size:13px;">Guests</td>
                <td style="padding:8px 0;color:#021a1a;font-size:13px;">${booking.guests} person${booking.guests !== 1 ? "s" : ""}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#94a3a3;font-size:13px;">Status</td>
                <td style="padding:8px 0;">
                  <span style="background:rgba(201,168,76,0.15);color:#c9a84c;font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px;text-transform:uppercase;">Pending</span>
                </td>
              </tr>
            </table>
          </div>

          <div style="text-align:center;">
            <a href="https://caspian-routes.vercel.app/en/bookings"
               style="display:inline-block;background:linear-gradient(135deg,#0a7070,#0d9090);color:white;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:15px;font-weight:600;box-shadow:0 8px 24px rgba(10,112,112,0.3);">
              View My Bookings →
            </a>
          </div>
        </div>

        <div style="background:#f8fafa;padding:24px 40px;text-align:center;border-top:1px solid #e2eded;">
          <p style="color:#94a3a3;font-size:12px;margin:0;">Caspian Routes DMC · Azerbaijan Travel Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function confirmationEmailTemplate(booking: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f0f7f7;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(4,46,46,0.1);">
        
        <div style="background:linear-gradient(135deg,#042e2e 0%,#0a7070 100%);padding:40px;text-align:center;">
          <div style="width:64px;height:64px;background:rgba(45,212,191,0.2);border-radius:50%;margin:0 auto 16px;line-height:64px;font-size:28px;">✅</div>
          <h1 style="color:white;font-size:28px;font-weight:300;margin:0 0 8px;font-family:Georgia,serif;">Booking Confirmed!</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;">Your guide has confirmed your booking</p>
        </div>

        <div style="padding:40px;">
          <p style="color:#4a6060;font-size:16px;margin:0 0 16px;">Hello <strong style="color:#021a1a;">${booking.clientName}</strong>,</p>
          <p style="color:#4a6060;font-size:15px;line-height:1.6;margin:0 0 32px;">
            Great news! <strong>${booking.providerName}</strong> has confirmed your booking. 
            Get ready for an amazing journey through Azerbaijan!
          </p>

          <div style="background:rgba(10,112,112,0.06);border:1px solid rgba(10,112,112,0.2);border-radius:16px;padding:24px;margin-bottom:32px;">
            <h3 style="color:#021a1a;font-size:16px;margin:0 0 16px;font-family:Georgia,serif;">Confirmed Booking</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#94a3a3;font-size:13px;width:40%;">Guide</td><td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.providerName}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3a3;font-size:13px;">Route</td><td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.routeName || "Custom Tour"}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3a3;font-size:13px;">Date</td><td style="padding:8px 0;color:#021a1a;font-size:13px;font-weight:600;">${booking.date}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3a3;font-size:13px;">Guests</td><td style="padding:8px 0;color:#021a1a;font-size:13px;">${booking.guests} person${booking.guests !== 1 ? "s" : ""}</td></tr>
            </table>
          </div>

          <div style="text-align:center;">
            <a href="https://caspian-routes.vercel.app/en/bookings"
               style="display:inline-block;background:linear-gradient(135deg,#0a7070,#0d9090);color:white;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:15px;font-weight:600;">
              View My Bookings →
            </a>
          </div>
        </div>

        <div style="background:#f8fafa;padding:24px 40px;text-align:center;border-top:1px solid #e2eded;">
          <p style="color:#94a3a3;font-size:12px;margin:0;">Caspian Routes DMC · Azerbaijan Travel Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function cancellationEmailTemplate(booking: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f0f7f7;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(4,46,46,0.1);">
        
        <div style="background:linear-gradient(135deg,#1a0202 0%,#500606 100%);padding:40px;text-align:center;">
          <h1 style="color:white;font-size:28px;font-weight:300;margin:0 0 8px;font-family:Georgia,serif;">Booking Update</h1>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0;">Unfortunately your booking was not confirmed</p>
        </div>

        <div style="padding:40px;">
          <p style="color:#4a6060;font-size:16px;margin:0 0 16px;">Hello <strong style="color:#021a1a;">${booking.clientName}</strong>,</p>
          <p style="color:#4a6060;font-size:15px;line-height:1.6;margin:0 0 32px;">
            Unfortunately, <strong>${booking.providerName}</strong> was unable to confirm your booking for ${booking.date}. 
            Please try booking another guide or a different date.
          </p>

          <div style="text-align:center;">
            <a href="https://caspian-routes.vercel.app/en/routes"
               style="display:inline-block;background:linear-gradient(135deg,#0a7070,#0d9090);color:white;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:15px;font-weight:600;">
              Find Another Guide →
            </a>
          </div>
        </div>

        <div style="background:#f8fafa;padding:24px 40px;text-align:center;border-top:1px solid #e2eded;">
          <p style="color:#94a3a3;font-size:12px;margin:0;">Caspian Routes DMC · Azerbaijan Travel Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;
}