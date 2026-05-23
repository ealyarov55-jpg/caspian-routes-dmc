import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "azerbaijan travel";
  const key = process.env.UNSPLASH_ACCESS_KEY;

  if (!key) {
    return NextResponse.json({ url: null }, { status: 200 });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` } }
    );
    const data = await res.json();
    const photo = data?.results?.[0];
    if (!photo) return NextResponse.json({ url: null });

    await fetch(photo.links.download_location, {
      headers: { Authorization: `Client-ID ${key}` },
    });

    return NextResponse.json({
      url: photo.urls.regular,
      thumb: photo.urls.small,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    });
  } catch {
    return NextResponse.json({ url: null });
  }
}