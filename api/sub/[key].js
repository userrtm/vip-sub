export default async function handler(req, res) {
  const { key } = req.query;
  if (!key) return res.status(400).send("missing key");

  const target = `https://standart.lexum.sbs/sub/${encodeURIComponent(key)}`;
  const subUrl = `https://uservvip.com/api/sub/${encodeURIComponent(key)}`;

  const accept = req.headers.accept || "";
  const ua = req.headers["user-agent"] || "";
  const uaLower = ua.toLowerCase();

  const isApp =
    uaLower.includes("hiddify") ||
    uaLower.includes("happ") ||
    uaLower.includes("v2ray") ||
    uaLower.includes("v2rayng") ||
    uaLower.includes("v2raytun") ||
    uaLower.includes("v2box");

  const isBrowser = accept.includes("text/html") && !isApp;

  if (isBrowser) {
    const username = decodeNameFromKey(key) || "STANDART User";
    let usage = parseUserInfo(null);

    try {
      const infoReq = await fetch(target, {
        redirect: "follow",
        headers: {
          "User-Agent": ua || "Mozilla/5.0",
          "Accept": "*/*"
        }
      });

      usage = parseUserInfo(infoReq.headers.get("subscription-userinfo"));
    } catch {}

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(getHtml(username, subUrl, usage));
  }

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
    res.setHeader("profile-title", "STANDART");

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
    return decoded.split(",")[0]?.trim() || null;
  } catch {
    return null;
  }
}

function parseUserInfo(userInfo) {
  if (!userInfo) {
    return {
      usedText: "0 MB",
      totalText: "∞",
      percent: "0",
      daysLeft: "-",
      hoursLeft: "-",
      expireDate: "-"
    };
  }

  const data = {};
  userInfo.split(";").forEach(part => {
    const [k, v] = part.trim().split("=");
    data[k] = Number(v);
  });

  const upload = data.upload || 0;
  const download = data.download || 0;
  const total = data.total || 0;
  const expire = data.expire || 0;
  const used = upload + download;
  const percent = total > 0 ? Math.min(100, (used / total) * 100).toFixed(1) : "0";

  return {
    usedText: formatBytes(used),
    totalText: total > 0 ? formatBytes(total) : "∞",
    percent,
    ...formatExpireParts(expire)
  };
}

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return "0 MB";
  const gb = bytes / 1024 / 1024 / 1024;
  if (gb >= 1) return gb.toFixed(2) + " GB";
  const mb = bytes / 1024 / 1024;
  return mb.toFixed(1) + " MB";
}

function formatExpireParts(timestamp) {
  if (!timestamp) return { daysLeft: "-", hoursLeft: "-", expireDate: "-" };

  const now = Date.now();
  const expireMs = timestamp * 1000;
  const diff = expireMs - now;
  const date = new Date(expireMs).toLocaleDateString("ru-RU");

  if (diff <= 0) return { daysLeft: "expired", hoursLeft: "0", expireDate: date };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  return { daysLeft: String(days), hoursLeft: String(hours), expireDate: date };
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getHtml(username, subUrl, usage) {
  const safeName = escapeHtml(username);
  const safeUrl = escapeHtml(subUrl);
  const encUrl = encodeURIComponent(subUrl);

  return `<!DOCTYPE html>
<html lang="tk">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>STANDART</title>
<style>
*{box-sizing:border-box}
body{
  margin:0;
  min-height:100vh;
  font-family:Arial,sans-serif;
  color:#fff;
  background:
    radial-gradient(circle at 20% 0%,rgba(59,130,246,.35),transparent 28%),
    radial-gradient(circle at 90% 20%,rgba(168,85,247,.35),transparent 30%),
    linear-gradient(145deg,#020617,#07162f 45%,#11164d);
  padding:16px;
  overflow-x:hidden;
}
.bgText{
  position:fixed;
  inset:0;
  pointer-events:none;
  overflow:hidden;
  z-index:0;
}
.bgText span{
  position:absolute;
  color:rgba(255,255,255,.13);
  text-shadow:0 0 26px rgba(59,130,246,.55);
  font-size:72px;
  font-weight:900;
  letter-spacing:5px;
  animation:moveText 18s linear infinite;
  white-space:nowrap;
}
.bgText span:nth-child(1){top:7%;left:-80%;animation-duration:20s}
.bgText span:nth-child(2){top:28%;left:-95%;animation-duration:24s}
.bgText span:nth-child(3){top:52%;left:-75%;animation-duration:22s}
.bgText span:nth-child(4){top:76%;left:-100%;animation-duration:27s}
@keyframes moveText{
  from{transform:translateX(0)}
  to{transform:translateX(190vw)}
}
.lines{
  position:fixed;
  inset:0;
  pointer-events:none;
  z-index:0;
  opacity:.9;
  background:
    linear-gradient(90deg,transparent 0 47%,rgba(59,130,246,.18) 48%,transparent 50%),
    linear-gradient(0deg,transparent 0 47%,rgba(168,85,247,.16) 48%,transparent 50%);
  background-size:72px 72px;
  mask-image:radial-gradient(circle at center,black,transparent 78%);
  animation:gridMove 8s linear infinite;
}
@keyframes gridMove{to{background-position:72px 72px}}
.wrap{max-width:520px;margin:0 auto;padding:14px 0 28px;position:relative;z-index:2}
.langs{display:flex;gap:8px;justify-content:center;margin-bottom:18px}
.langs button{
  border:1px solid rgba(255,255,255,.18);
  background:rgba(255,255,255,.10);
  color:#fff;
  border-radius:14px;
  padding:10px 14px;
  font-weight:800;
}
.langs button.active{
  background:linear-gradient(135deg,#2563eb,#9333ea);
  box-shadow:0 0 20px rgba(147,51,234,.55);
}
.card{
  position:relative;
  overflow:hidden;
  background:rgba(15,23,42,.70);
  border:1px solid rgba(255,255,255,.18);
  border-radius:30px;
  padding:24px;
  box-shadow:0 25px 80px rgba(0,0,0,.50);
  backdrop-filter:blur(9px);
}
.card:before{
  content:"VPN FAST SECURE PREMIUM VPN FAST SECURE PREMIUM";
  position:absolute;
  top:40%;
  left:-40%;
  width:180%;
  color:rgba(255,255,255,.055);
  font-size:46px;
  font-weight:900;
  letter-spacing:8px;
  white-space:nowrap;
  transform:rotate(-18deg);
  animation:cardText 18s linear infinite;
  pointer-events:none;
}
@keyframes cardText{
  from{transform:translateX(-10%) rotate(-18deg)}
  to{transform:translateX(25%) rotate(-18deg)}
}
.logo{
  position:relative;
  z-index:1;
  width:86px;height:86px;
  border-radius:28px;
  margin:0 auto 16px;
  display:grid;place-items:center;
  background:linear-gradient(135deg,#2563eb,#a855f7,#ec4899);
  font-size:36px;
  font-weight:900;
  box-shadow:0 0 35px rgba(168,85,247,.65);
}
h1,.desc,.userBox,.usageBox,.sectionTitle,.app,.qrBtn,.qrBox{position:relative;z-index:1}
h1{text-align:center;margin:0 0 8px;font-size:32px}
.desc{text-align:center;color:#d6def5;line-height:1.55;margin-bottom:22px}
.userBox,.usageBox{
  background:rgba(0,0,0,.34);
  border:1px solid rgba(255,255,255,.15);
  border-radius:24px;
}
.userBox{padding:18px;text-align:center;margin-bottom:16px}
.userLabel{font-size:13px;color:#aab7d8;margin-bottom:8px}
.username{font-size:26px;font-weight:900;cursor:pointer}
.copyHint{font-size:12px;color:#aab7d8;margin-top:8px}
.usageBox{padding:16px;margin-bottom:22px}
.usageTop,.usageBottom{
  display:flex;
  justify-content:space-between;
  gap:10px;
  font-size:14px;
  color:#d6def5;
}
.usageBottom{flex-wrap:wrap}
.usageTop b{color:white}
.bar{
  height:13px;
  background:rgba(255,255,255,.15);
  border-radius:999px;
  overflow:hidden;
  margin:12px 0;
}
.barFill{
  height:100%;
  background:linear-gradient(90deg,#22c55e,#3b82f6,#a855f7);
  border-radius:999px;
  box-shadow:0 0 20px rgba(59,130,246,.8);
}
.sectionTitle{font-size:20px;font-weight:900;margin:22px 0 12px}
.app{
  width:100%;
  border:0;
  color:white;
  border-radius:24px;
  padding:17px;
  margin:12px 0;
  display:flex;
  align-items:center;
  gap:15px;
  text-align:left;
  cursor:pointer;
  box-shadow:0 14px 34px rgba(0,0,0,.32);
}
.icon{
  width:58px;height:58px;
  border-radius:18px;
  display:grid;place-items:center;
  background:rgba(255,255,255,.20);
  font-size:26px;
  font-weight:900;
}
.txt{flex:1}
.title{font-size:20px;font-weight:900}
.sub{font-size:14px;color:rgba(255,255,255,.84);margin-top:5px}
.arrow{font-size:34px}
.hiddify{background:linear-gradient(135deg,#7c3aed,#2563eb)}
.v2raytun{background:linear-gradient(135deg,#1d4ed8,#2563eb)}
.v2rayng{background:linear-gradient(135deg,#7c3aed,#4338ca)}
.v2box{background:linear-gradient(135deg,#1e40af,#2563eb)}
.happ{background:linear-gradient(135deg,#8b5cf6,#db2777)}
.qrBtn{
  width:100%;
  border:1px solid rgba(255,255,255,.16);
  background:rgba(0,0,0,.34);
  color:#fff;
  border-radius:22px;
  padding:16px;
  font-size:17px;
  font-weight:900;
  margin-top:18px;
}
.qrBox{display:none;margin-top:18px;text-align:center;background:white;padding:16px;border-radius:22px}
.qrBox img{width:230px;height:230px}
.qrText{color:#0f172a;font-size:12px;word-break:break-all;margin-top:10px}
.toast{
  display:none;
  position:fixed;
  left:50%;
  bottom:24px;
  transform:translateX(-50%);
  background:#22c55e;
  color:#fff;
  padding:13px 18px;
  border-radius:999px;
  font-weight:900;
  z-index:99;
}
</style>
</head>
<body>
<div class="bgText">
  <span>VPN • FAST • SECURE • USERRTM</span>
  <span>PREMIUM VPN • STANDART ACCESS</span>
  <span>SECURE CONNECTION • FAST SERVER</span>
  <span>USERRTM SERVERS • VPN • PREMIUM</span>
</div>
<div class="lines"></div>

<div class="wrap">
  <div class="langs">
    <button id="tkBtn" onclick="setLang('tk')" class="active">Türkmençe</button>
    <button id="trBtn" onclick="setLang('tr')">Türkçe</button>
    <button id="ruBtn" onclick="setLang('ru')">Русский</button>
  </div>

  <div class="card">
    <div class="logo">U</div>
    <h1>STANDART VPN</h1>
    <div class="desc" id="mainDesc">Subscription linkiňizi aşakdaky programmalara bir basyş bilen goşuň.</div>

    <div class="userBox">
      <div class="userLabel" id="userLabel">Ulanyjy ady</div>
      <div class="username" onclick="copyName()">${safeName}</div>
      <div class="copyHint" id="copyHint">Adyň üstüne basyň — göçüriler</div>
    </div>

    <div class="usageBox">
      <div class="usageTop">
        <span id="usedLabel">Ulanylan</span>
