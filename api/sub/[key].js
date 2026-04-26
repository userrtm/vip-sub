export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(400).send("missing key");
  }

  const target = `https://dolphi.online/proxy/vip/sub/${key}`;

  try {
    const r = await fetch(target, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
        "Accept": "*/*"
      }
    });

    if (!r.ok) {
      return res.status(r.status).send("upstream error");
    }

    const text = await r.text();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // client uyumluluk
    res.setHeader("profile-update-interval", "6");
    res.setHeader("subscription-userinfo", "upload=0; download=0; total=0; expire=0");

    return res.status(200).send(text);
  } catch (e) {
    return res.status(500).send("proxy error");
  }
}
