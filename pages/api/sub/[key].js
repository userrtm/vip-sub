export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(400).send("missing key");
  }

  let target;

  if (key.startsWith("WX")) {
    target = `https://standartuserrtm.pro/proxy/vpn/sub/${encodeURIComponent(key)}`;
  } else {
    target = `https://dolphi.online/proxy/vip/sub/${encodeURIComponent(key)}`;
  }

  try {
    const r = await fetch(target, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0"
      }
    });

    const text = await r.text();

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(r.status).send(text);
  } catch {
    return res.status(500).send("proxy error");
  }
}
