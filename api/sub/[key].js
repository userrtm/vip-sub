export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) return res.status(400).send("missing key");

  const target = `https://standart.lexum.sbs/sub/${encodeURIComponent(key)}`;

  const accept = req.headers.accept || "";
  const ua = req.headers["user-agent"] || "";

  const isBrowser = accept.includes("text/html");

  // 🌐 Browser açarsa sadece sade site
  if (isBrowser) {
    const username = decodeNameFromKey(key) || "Luxury User";

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Luxury VPN</title>
<style>
body{
  margin:0;
  font-family:Arial;
  background:linear-gradient(160deg,#0b0f2a,#111827);
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  height:100vh;
}
.card{
  background:rgba(255,255,255,0.1);
  padding:30px;
  border-radius:20px;
  text-align:center;
}
.name{
  font-size:22px;
  font-weight:bold;
  margin-top:10px;
  cursor:pointer;
}
.small{
  opacity:0.6;
  font-size:14px;
}
</style>
</head>
<body>

<div class="card">
  <h1>Luxury VPN</h1>
  <div class="small">User</div>
  <div class="name" onclick="copyName()">${username}</div>
  <div class="small">Click to copy</div>
</div>

<script>
function copyName(){
  navigator.clipboard.writeText("${username}");
  alert("Copied");
}
</script>

</body>
</html>
    `);
  }

  // 📡 App gelirse subscription ver
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
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("profile-update-interval", "6");
    res.setHeader("profile-title", "Luxury");

    const userInfo = r.headers.get("subscription-userinfo");
    if (userInfo) {
      res.setHeader("subscription-userinfo", userInfo);
    }

    return res.status(r.status).send(text);

  } catch {
    return res.status(500).send("proxy error");
  }
}

function decodeNameFromKey(key) {
  try {
    const clean = key.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(clean, "base64").toString("utf8");
    return decoded.split(",")[0];
  } catch {
    return null;
  }
}
