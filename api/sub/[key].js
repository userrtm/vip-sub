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
    const username = decodeNameFromKey(key) || "Luxury User";
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(getHtml(username, subUrl));
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
    return decoded.split(",")[0]?.trim() || null;
  } catch {
    return null;
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getHtml(username, subUrl) {
  const safeName = escapeHtml(username);
  const safeUrl = escapeHtml(subUrl);
  const encUrl = encodeURIComponent(subUrl);

  return `<!DOCTYPE html>
<html lang="tk">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Luxury VPN</title>
<style>
*{box-sizing:border-box}
body{
  margin:0;
  min-height:100vh;
  font-family:Arial,sans-serif;
  color:#fff;
  background:
    radial-gradient(circle at top,#2633a3 0,#07142f 45%,#020617 100%);
  padding:16px;
}
.wrap{max-width:520px;margin:0 auto;padding:14px 0 28px}
.langs{
  display:flex;
  gap:8px;
  justify-content:center;
  margin-bottom:18px;
}
.langs button{
  border:1px solid rgba(255,255,255,.14);
  background:rgba(255,255,255,.08);
  color:#fff;
  border-radius:14px;
  padding:10px 14px;
  font-weight:800;
}
.langs button.active{
  background:linear-gradient(135deg,#2563eb,#9333ea);
}
.card{
  background:rgba(255,255,255,.09);
  border:1px solid rgba(255,255,255,.12);
  border-radius:28px;
  padding:24px;
  box-shadow:0 25px 70px rgba(0,0,0,.45);
}
.logo{
  width:82px;height:82px;
  border-radius:26px;
  margin:0 auto 16px;
  display:grid;place-items:center;
  background:linear-gradient(135deg,#2563eb,#a855f7);
  font-size:34px;
  font-weight:900;
}
h1{text-align:center;margin:0 0 8px;font-size:30px}
.desc{text-align:center;color:#cbd5e1;line-height:1.55;margin-bottom:22px}
.userBox{
  background:rgba(0,0,0,.28);
  border:1px solid rgba(255,255,255,.12);
  border-radius:22px;
  padding:18px;
  text-align:center;
  margin-bottom:20px;
}
.userLabel{font-size:13px;color:#94a3b8;margin-bottom:8px}
.username{
  font-size:25px;
  font-weight:900;
  cursor:pointer;
}
.copyHint{font-size:12px;color:#94a3b8;margin-top:8px}
.sectionTitle{font-size:19px;font-weight:900;margin:22px 0 12px}
.app{
  width:100%;
  border:0;
  color:white;
  border-radius:22px;
  padding:17px;
  margin:12px 0;
  display:flex;
  align-items:center;
  gap:15px;
  text-align:left;
  cursor:pointer;
}
.icon{
  width:58px;height:58px;
  border-radius:18px;
  display:grid;place-items:center;
  background:rgba(255,255,255,.18);
  font-size:26px;
  font-weight:900;
}
.txt{flex:1}
.title{font-size:20px;font-weight:900}
.sub{font-size:14px;color:rgba(255,255,255,.82);margin-top:5px}
.arrow{font-size:34px}
.hiddify{background:linear-gradient(135deg,#7c3aed,#2563eb)}
.v2raytun{background:linear-gradient(135deg,#1d4ed8,#2563eb)}
.v2rayng{background:linear-gradient(135deg,#7c3aed,#4338ca)}
.v2box{background:linear-gradient(135deg,#1e40af,#2563eb)}
.happ{background:linear-gradient(135deg,#8b5cf6,#db2777)}
.qrBtn{
  width:100%;
  border:1px solid rgba(255,255,255,.14);
  background:rgba(0,0,0,.32);
  color:#fff;
  border-radius:20px;
  padding:16px;
  font-size:17px;
  font-weight:900;
  margin-top:18px;
}
.qrBox{
  display:none;
  margin-top:18px;
  text-align:center;
  background:white;
  padding:16px;
  border-radius:22px;
}
.qrBox img{width:230px;height:230px}
.qrText{
  color:#0f172a;
  font-size:12px;
  word-break:break-all;
  margin-top:10px;
}
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
}
</style>
</head>
<body>
<div class="wrap">
  <div class="langs">
    <button id="tkBtn" onclick="setLang('tk')" class="active">Türkmençe</button>
    <button id="trBtn" onclick="setLang('tr')">Türkçe</button>
    <button id="ruBtn" onclick="setLang('ru')">Русский</button>
  </div>

  <div class="card">
    <div class="logo">U</div>
    <h1 id="mainTitle">Luxury VPN</h1>
    <div class="desc" id="mainDesc">Subscription linkiňizi aşakdaky programmalara bir basyş bilen goşuň.</div>

    <div class="userBox">
      <div class="userLabel" id="userLabel">Ulanyjy ady</div>
      <div class="username" onclick="copyName()">${safeName}</div>
      <div class="copyHint" id="copyHint">Adyň üstüne basyň — göçüriler</div>
    </div>

    <div class="sectionTitle" id="appsTitle">Programma saýlaň</div>

    <button class="app hiddify" onclick="openHiddify()">
      <div class="icon">H</div>
      <div class="txt"><div class="title" id="hiddifyTitle">Hiddify'a Goş</div><div class="sub" id="hiddifySub">Hiddify programmasynda aç</div></div>
      <div class="arrow">›</div>
    </button>

    <button class="app v2raytun" onclick="openV2RayTun()">
      <div class="icon">V2</div>
      <div class="txt"><div class="title" id="v2raytunTitle">v2RayTun'a Goş</div><div class="sub" id="v2raytunSub">v2RayTun programmasynda aç</div></div>
      <div class="arrow">›</div>
    </button>

    <button class="app v2rayng" onclick="openV2RayNG()">
      <div class="icon">V</div>
      <div class="txt"><div class="title" id="v2rayngTitle">v2RayNG'ye Goş</div><div class="sub" id="v2rayngSub">v2RayNG programmasynda aç</div></div>
      <div class="arrow">›</div>
    </button>

    <button class="app v2box" onclick="openV2Box()">
      <div class="icon">V²</div>
      <div class="txt"><div class="title" id="v2boxTitle">V2Box'a Goş</div><div class="sub" id="v2boxSub">V2Box programmasynda aç</div></div>
      <div class="arrow">›</div>
    </button>

    <button class="app happ" onclick="openHapp()">
      <div class="icon">H</div>
      <div class="txt"><div class="title" id="happTitle">Happ'a Goş</div><div class="sub" id="happSub">Happ programmasynda aç</div></div>
      <div class="arrow">›</div>
    </button>

    <button class="qrBtn" onclick="toggleQr()" id="qrBtn">QR kod görkez</button>

    <div class="qrBox" id="qrBox">
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encUrl}" alt="QR Code">
      <div class="qrText">${safeUrl}</div>
    </div>
  </div>
</div>

<div class="toast" id="toast">Göçürildi</div>

<script>
const subUrl = "${safeUrl}";
const username = "${safeName}";

const texts = {
  tk:{
    mainDesc:"Subscription linkiňizi aşakdaky programmalara bir basyş bilen goşuň.",
    userLabel:"Ulanyjy ady",
    copyHint:"Adyň üstüne basyň — göçüriler",
    appsTitle:"Programma saýlaň",
    hiddifyTitle:"Hiddify'a Goş",
    hiddifySub:"Hiddify programmasynda aç",
    v2raytunTitle:"v2RayTun'a Goş",
    v2raytunSub:"v2RayTun programmasynda aç",
    v2rayngTitle:"v2RayNG'ye Goş",
    v2rayngSub:"v2RayNG programmasynda aç",
    v2boxTitle:"V2Box'a Goş",
    v2boxSub:"V2Box programmasynda aç",
    happTitle:"Happ'a Goş",
    happSub:"Happ programmasynda aç",
    qrBtn:"QR kod görkez",
    copied:"Ulanyjy ady göçürildi"
  },
  tr:{
    mainDesc:"Subscription linkinizi aşağıdaki uygulamalara tek dokunuşla ekleyin.",
    userLabel:"Kullanıcı adı",
    copyHint:"İsme basın — kopyalanır",
    appsTitle:"Uygulama seçin",
    hiddifyTitle:"Hiddify'a Ekle",
    hiddifySub:"Hiddify uygulamasında aç",
    v2raytunTitle:"v2RayTun'a Ekle",
    v2raytunSub:"v2RayTun uygulamasında aç",
    v2rayngTitle:"v2RayNG'ye Ekle",
    v2rayngSub:"v2RayNG uygulamasında aç",
    v2boxTitle:"V2Box'a Ekle",
    v2boxSub:"V2Box uygulamasında aç",
    happTitle:"Happ'a Ekle",
    happSub:"Happ uygulamasında aç",
    qrBtn:"QR kodu göster",
    copied:"Kullanıcı adı kopyalandı"
  },
  ru:{
    mainDesc:"Добавьте subscription ссылку в приложение одним нажатием.",
    userLabel:"Имя пользователя",
    copyHint:"Нажмите на имя — скопируется",
    appsTitle:"Выберите приложение",
    hiddifyTitle:"Добавить в Hiddify",
    hiddifySub:"Открыть в Hiddify",
    v2raytunTitle:"Добавить в v2RayTun",
    v2raytunSub:"Открыть в v2RayTun",
    v2rayngTitle:"Добавить в v2RayNG",
    v2rayngSub:"Открыть в v2RayNG",
    v2boxTitle:"Добавить в V2Box",
    v2boxSub:"Открыть в V2Box",
    happTitle:"Добавить в Happ",
    happSub:"Открыть в Happ",
    qrBtn:"Показать QR-код",
    copied:"Имя пользователя скопировано"
  }
};

let lang = localStorage.getItem("lang") || "tk";

function setLang(l){
  lang = l;
  localStorage.setItem("lang", l);
  document.querySelectorAll(".langs button").forEach(b=>b.classList.remove("active"));
  document.getElementById(l+"Btn").classList.add("active");

  const t = texts[l];
  for (const k in t) {
    const el = document.getElementById(k);
    if (el) el.innerText = t[k];
  }
}

function showToast(msg){
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.style.display = "block";
  setTimeout(()=>toast.style.display="none",1700);
}

function copyName(){
  navigator.clipboard.writeText(username);
  showToast(texts[lang].copied);
}

function openHiddify(){
  location.href = "hiddify://import/" + subUrl + "#Luxury";
}

function openV2RayTun(){
  location.href = "v2raytun://import/" + subUrl;
}

function openV2RayNG(){
  location.href = "v2rayng://install-sub?url=" + encodeURIComponent(subUrl) + "&name=" + encodeURIComponent("Luxury");
}

function openV2Box(){
  location.href = "v2box://install-config?url=" + encodeURIComponent(subUrl);
}

function openHapp(){
  location.href = "happ://add/" + subUrl;
}

function toggleQr(){
  const box = document.getElementById("qrBox");
  box.style.display = box.style.display === "block" ? "none" : "block";
}

setLang(lang);
</script>
</body>
</html>`;
}
