

const scriptsInEvents = {

	async 事件表4_Event2(runtime, localVars)
	{

	},

	async 事件表4_Event5(runtime, localVars)
	{

	},

	async 事件表4_Event8(runtime, localVars)
	{

	},

	async 事件表4_Event10(runtime, localVars)
	{
		
	},

	async 事件表4_Event13(runtime, localVars)
	{
// ===== 初始化階段：定義函式 (全域可用) =====
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
    console.log("📍 目前位置：", lat, lon);

    // 2️⃣ 查詢全家便利商店
    const query = `
    [out:json];
    node["name"~"全家|FamilyMart"](around:${radius},${lat},${lon});
    out;
    `;

    // 3️⃣ 使用台灣中研院鏡像 API
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const res = await fetch(overpassUrl, {
      method: "POST",
      body: query,
    });

    if (!res.ok) {
      console.error("❌ Overpass API 失敗，狀態碼：" + res.status);
      return;
    }

    const text = await res.text();

    // 4️⃣ 嘗試解析 JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.warn("⚠️ 回傳內容不是 JSON（伺服器可能忙碌）：\n", text.slice(0, 200));
      return;
    }

    // 5️⃣ 計算結果
    const count = data.elements.length;
    console.log(`🏪 半徑 ${radius} 公尺內共有 ${count} 家全家便利商店。`);
  } catch (err) {
    console.error("❌ 偵測失敗：" + (err.message || err));
  }
};

console.log("✅ checkNearbyStores() 已載入完成，可隨時呼叫");

	},

	async 事件表4_Event16(runtime, localVars)
	{

	},

	async 事件表4_Event18(runtime, localVars)
	{
// ===== Nominatim 版本：查詢附近全家便利商店並列出名稱 =====
// 可直接放在 Construct 3 的 Run JavaScript 內使用
// 使用官方 API：https://nominatim.openstreetmap.org/

async function checkNearbyFamilyMart(radiusMeters = 500) {
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

    // 2️⃣ 計算查詢邊界框（用於 Nominatim 的 viewbox）
    const delta = radiusMeters / 111000; // 大約每 1 度 ≈ 111 公里
    const left = lon - delta;
    const right = lon + delta;
    const top = lat + delta;
    const bottom = lat - delta;

    // 3️⃣ 組合查詢 URL
    const queryUrl = `https://nominatim.openstreetmap.org/search?format=json&q=FamilyMart&bounded=1&viewbox=${left},${top},${right},${bottom}`;

    // 4️⃣ 查詢 API
    const res = await fetch(queryUrl, {
      headers: {
        "Accept-Language": "zh-TW",
        "User-Agent": "DeepDreamGame-Test-App (deepdreamgame.tw)"
      }
    });

    if (!res.ok) throw new Error("Nominatim API 錯誤：" + res.status);
    const data = await res.json();

    // 5️⃣ 若沒找到任何店
    if (data.length === 0) {
      console.log(`😅 半徑 ${radiusMeters} 公尺內沒有找到任何全家便利商店。`);
      return;
    }

    // 6️⃣ 列出店名
    console.log(`🏪 半徑 ${radiusMeters} 公尺內找到 ${data.length} 家全家便利商店：`);
    data.forEach((item, index) => {
      console.log(`${index + 1}. ${item.display_name}`);
    });

  } catch (err) {
    console.error("❌ 偵測失敗：" + (err.message || err));
  }
}

// 🔹 按鈕觸發時呼叫（查500公尺內）
checkNearbyFamilyMart(500);

	}
};

globalThis.C3.JavaScriptInEvents = scriptsInEvents;
