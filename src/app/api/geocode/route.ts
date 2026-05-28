import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { places } = await req.json();
    const key = process.env.GOOGLE_GEOCODING_KEY;

    const results = await Promise.all(
      places.map(async (place: string) => {
        const query = `${place}, Azerbaijan`;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${key}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.results?.[0]?.geometry?.location) {
          return {
            place,
            lat: data.results[0].geometry.location.lat,
            lng: data.results[0].geometry.location.lng,
          };
        }
        return { place, lat: 40.4093, lng: 49.8671 }; // fallback Baku
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
  }
}