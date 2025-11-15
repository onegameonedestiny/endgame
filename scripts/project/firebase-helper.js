// === Firebase Helper for Construct 3 ===
// ⚙️ 使用 compat 版本，確保 window.firebase 可用
// 功能：初始化 / 讀取 / 更新 playerdata/{plykey}
// 不自動建立文件，僅能更新現有文件。

window.InitFirebase = async function () {
  if (window._initPromise) return window._initPromise;
  console.log("🚀 Initializing Firebase (compat mode)...");

  // ✅ 使用 compat 版本 SDK
  const load = url => import(url);
  await load("https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js");
  await load("https://www.gstatic.com/firebasejs/11.0.1/firebase-auth-compat.js");
  await load("https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore-compat.js");

  // ✅ 你的 Firebase 設定
  const firebaseConfig = {
    apiKey: "AIzaSyCK7sNXMML-IA_ZjaiAOXyN8ftCrLn39uA",
    authDomain: "theendoftheworld.firebaseapp.com",
    projectId: "theendoftheworld",
    storageBucket: "theendoftheworld.appspot.com",
    messagingSenderId: "333484279077",
    appId: "1:333484279077:web:53ddd6067e1f4b45c3c6cc"
  };

  // ✅ 初始化
  firebase.initializeApp(firebaseConfig);
  window._db = firebase.firestore();
  const auth = firebase.auth();

  // ✅ 匿名登入
  window._initPromise = new Promise((resolve, reject) => {
    auth.signInAnonymously()
      .then(() => {
        auth.onAuthStateChanged(user => {
          if (user) {
            console.log("✅ Firebase connected (UID):", user.uid);
            window._firebaseReady = true;
            resolve(true);
          }
        });
      })
      .catch(err => {
        console.error("❌ Firebase init failed:", err);
        reject(err);
      });
  });

  return window._initPromise;
};


// === 📖 讀取玩家資料 ===
window.GetPlayerData = async function (plykey, lineid) {
  if (!_initPromise) await window.InitFirebase();
  await _initPromise;

  try {
    const ref = _db.collection("playerdata").doc(plykey);
    const snap = await ref.get();

    if (!snap.exists) {
      console.warn(`⚠️ playerdata/${plykey} 不存在`);
      return null;
    }

    const data = snap.data();
    if (data.lineid !== lineid) {
      console.warn(`🚫 lineid 不符 (${lineid} ≠ ${data.lineid})`);
      return null;
    }

    console.log(`📖 已讀取 playerdata/${plykey}`, data);
    return data;

  } catch (err) {
    console.error("❌ GetPlayerData failed:", err);
    return null;
  }
};


// === ✏️ 更新玩家資料（不自動建立文件） ===
window.UpdatePlayerData = async function (plykey, lineid, updates) {
  if (!_initPromise) await window.InitFirebase();
  await _initPromise;

  try {
    const ref = _db.collection("playerdata").doc(plykey);
    const snap = await ref.get();

    if (!snap.exists) {
      console.warn(`⚠️ playerdata/${plykey} 不存在`);
      return { success: false, message: "Document not found" };
    }

    const data = snap.data();
    if (data.lineid !== lineid) {
      console.warn(`🚫 lineid 不符 (${lineid} ≠ ${data.lineid})`);
      return { success: false, message: "LineID mismatch" };
    }

    await ref.update(updates);
    console.log(`🔥 已更新 playerdata/${plykey}`, updates);

    return { success: true, message: "Update successful" };

  } catch (err) {
    console.error("❌ UpdatePlayerData failed:", err);
    return { success: false, message: err.message };
  }
};
