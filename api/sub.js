export default async function handler(req, res) {
  const target = process.env.SUB_URL;

  if (!target) {
    return res.status(500).send("SUB_URL missing");
  }

  try {
    const r = await fetch(target, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0"
      }
    });

    const text = await r.text();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("profile-update-interval", "6");
    res.setHeader("subscription-userinfo", "upload=0; download=0; total=0; expire=0");

    return res.status(200).send(text);
  } catch (e) {
    return res.status(500).send("proxy error");
  }
}
