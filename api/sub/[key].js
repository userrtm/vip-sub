export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) return res.status(400).send("missing key");

  const subUrl = `https://uservvip.com/api/sub/${encodeURIComponent(key)}`;
  const target = `https://standart.lexum.sbs/sub/${encodeURIComponent(key)}`;

  const accept = req.headers.accept || "";
  const ua = req.headers["user-agent"] || "";

  const isBrowser =
    accept.includes("text/html") &&
    !ua.toLowerCase().includes("hiddify") &&
    !ua.toLowerCase().includes("happ") &&
    !ua.toLowerCase().includes("v2ray") &&
    !ua.toLowerCase().includes("nekobox");

  // Browser açanda sahypa görkez
  if (isBrowser) {
    const username = decodeNameFromKey(key) || "User";

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(`
<!DOCTYPE html>
<html lang="tk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${username} - Luxury VPN</title>
  <style>
    body {
      margin:0;
      font-family:Arial,sans-serif;
      background:linear-gradient(160deg,#07142f,#0b49d8);
      color:white;
      min-height:100vh;
      padding:24px;
    }
    .card {
      max-width:430px;
      margin:30px auto;
      background:rgba(255,255,255,.12);
      border-radius:24px;
      padding:24px;
      box-shadow:0 20px 50px rgba(0,0,0,.35);
    }
    h1 { margin:0 0 8px; font-size:28px; }
    .name { font-size:22px; font-weight:700; margin:18px 0; }
    .btn {
      display:block;
      text-decoration:none;
      color:white;
      padding:16px;
      border-radius:14px;
      margin:12px 0;
      font-weight:700;
      text-align:center;
    }
    .hiddify { background:#22c55e; }
    .happ { background:#2563eb; }
    .copy { background:#111827; }
    .small { opacity:.8; font-size:14px; line-height:1.5; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Luxury VPN</h1>
    <div class="small">Abuna ulanyjysy:</div>
    <div class="name">👤 ${username}</div>

    <a class="btn hiddify" href="hiddify://import/${encodeURIComponent(subUrl)}">
      Hiddify bilen goş
    </a>

    <a class="btn happ" href="happ://add/${encodeURIComponent(subUrl)}">
      Happ bilen goş
    </a>

    <a class="btn copy" href="${subUrl}">
      Raw subscription aç
    </a>

    <p class="small">
      Eger programma awtomat açylmasa, ýokardaky düwmä basyň ýa-da linki göçürip programma el bilen goşuň.
    </p>
  </div>
</body>
</html>
    `);
  }

  // App gelende subscription ber
  try {
    const r = await fetch(target, {
      redirect: "follow",
      headers: {
        "User-Agent": ua || "Mozilla/5.0",
        "Accept": "*/*"
      }
    });

    const text = await r.text();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("profile-update-interval", "6");
    res.setHeader("profile-title", "Luxury");

    const userInfo = r.headers.get("subscription-userinfo");
    if (userInfo) res.setHeader("subscription-userinfo", userInfo);

    return res.status(r.status).send(text);
  } catch {
    return res.status(500).send("proxy error");
  }
}

function decodeNameFromKey(key) {
  try {
    const clean = key.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(clean, "base64").toString("utf8");
    return decoded.split(",")[0] || null;
  } catch {
    return null;
  }
}
