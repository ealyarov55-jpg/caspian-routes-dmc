import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "azerbaijan travel";
  const key = process.env.PEXELS_API_KEY;

  if (!key) {
    return NextResponse.json({ url: null }, { status: 200 });
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: key } }
    );
    const data = await res.json();
    const photo = data?.photos?.[0];
    if (!photo) return NextResponse.json({ url: null });

    return NextResponse.json({
      url: photo.src.large,
      thumb: photo.src.medium,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
    });
  } catch {
    return NextResponse.json({ url: null });
  }
}