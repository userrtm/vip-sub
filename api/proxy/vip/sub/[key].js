export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(400).send("missing key");
  }

  const target = `https://dolphi.online/proxy/vip/sub/${encodeURIComponent(key)}`;

  try {
    const r = await fetch(target, {
      redirect: "follow",
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
        "Accept": "*/*"
      }
    });

    const text = await r.text();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("profile-update-interval", "6");

    const userInfo = r.headers.get("subscription-userinfo");
    if (userInfo) {
      res.setHeader("subscription-userinfo", userInfo);
    }

    return res.status(r.status).send(text);
  } catch (e) {
    return res.status(500).send("proxy error");
  }
}
