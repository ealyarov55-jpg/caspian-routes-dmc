import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194304.64910730564!2d49.6570777!3d40.3947365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6605f2a7c9ba!2z0J_QkNCa0KMsINCQ0LfQtdGA0LHQsNC50LTQttCw0L0!5e0!3m2!1sru!2s!4v1620000000000!5m2!1sru!2s"
  });
}