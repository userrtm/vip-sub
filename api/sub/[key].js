export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(400).send("missing key");
  }

  let target;

  if (key.startsWith("WX")) {
    target = `https://standartuserrtm.pro/proxy/vpn/sub/${encodeURIComponent(key)}`;
    res.setHeader("profile-title", "Luxury");
  } else {
    target = `https://dolphi.online/proxy/vip/sub/${encodeURIComponent(key)}`;
    res.setHeader("profile-title", "VIP SERVERS");
  }

  try {
    const r = await fetch(target, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
        "Accept": "*/*"
      }
    });

    const text = await r.text();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("profile-update-interval", "6");

    // ÖNEMLİ: userinfo geçirmeye devam
    const userInfo = r.headers.get("subscription-userinfo");
    if (userInfo) {
      res.setHeader("subscription-userinfo", userInfo);
    }

    return res.status(r.status).send(text);

  } catch {
    return res.status(500).send("proxy error");
  }
}
