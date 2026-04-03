export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJ11LOEa4RqTkRq2LjLtLPb2o';

  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: 'GOOGLE_API_KEY not configured' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${PLACE_ID}` +
      `&fields=name,rating,user_ratings_total,reviews` +
      `&reviews_sort=newest` +
      `&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return res.status(502).json({ error: data.status, message: data.error_message });
    }

    const place = data.result;
    const reviews = (place.reviews || []).map(r => ({
      author: r.author_name,
      avatar: r.profile_photo_url || null,
      rating: r.rating,
      text: r.text,
      time: r.relative_time_description,
    }));

    // Cache for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    return res.status(200).json({
      name: place.name,
      rating: place.rating,
      total: place.user_ratings_total,
      reviews,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error', detail: String(err) });
  }
}
