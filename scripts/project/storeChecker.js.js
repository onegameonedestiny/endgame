// ===== storeChecker.js =====
// 將函式掛在全域 window 底下，讓 C3 可直接呼叫
window.checkNearbyStores = async function (radius = 100) {
  try {
    // 1️⃣ 取得玩家 GPS
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 8000,
      });
    });

    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    console.log("📍 玩家位置：", lat, lon);

    // 2️⃣ 建立 Overpass 查詢字串
    const query = `
    [out:json];
    (
      node["shop"="convenience"](around:${radius},${lat},${lon});
      node["name"~"7-Eleven"](around:${radius},${lat},${lon});
      node["name"~"全家"](around:${radius},${lat},${lon});
      node["name"~"OK"](around:${radius},${lat},${lon});
      node["name"~"萊爾富"](around:${radius},${lat},${lon});
    );
    out center;
    `;

    // 3️⃣ 查詢 Overpass API
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    const data = await res.json();
    const count = data.elements.length;

    // 4️⃣ 顯示結果
    console.log(`🏪 半徑 ${radius} 公尺內共有 ${count} 家超商。`);
    return count;
  } catch (err) {
    console.error("❌ 偵測失敗：", err.message || err);
    return -1;
  }
};
