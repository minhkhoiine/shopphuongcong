// -------- Chatbot: tìm sản phẩm bằng ID --------
let products = [];
let productsLoaded = false;

// Load dữ liệu khi trang sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  fetch("products.json")
    .then(r => r.json())
    .then(d => { products = d; productsLoaded = true; })
    .catch(e => console.error("Không tải được products.json:", e));

  // Enter để gửi
  const input = document.getElementById("userInput");
  if (input) input.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });
});

function toggleChat() {
  const w = document.getElementById("chatWidget");
  w.style.display = (w.style.display === "flex" ? "none" : "flex");
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = (input.value || "").trim();
  if (!msg) return;

  addMessageText(msg, "user");
  input.value = "";

  if (!productsLoaded) {
    addMessageText("Đang tải dữ liệu sản phẩm, thử lại sau nhé.", "bot");
    return;
  }

  const lower = msg.toLowerCase();

  // Hiện danh sách
  if (lower === "danh sách" || lower === "ds" || lower === "list") {
    const list = products.map(p => `#${p.id} • ${p.name} • ${p.price}`).join("\n");
    addMessageText(list || "Chưa có sản phẩm.", "bot");
    return;
  }

  // Lấy ID: "1" hoặc "sp1"/"SP 1"
  const m = lower.match(/(?:^|\b)sp\s*(\d+)\b|^(\d+)$/);
  const id = m ? parseInt(m[1] || m[2], 10) : null;

  if (!id) {
    addMessageText("Vui lòng nhập ID sản phẩm (vd: 1 hoặc sp1). Hoặc gõ “danh sách”.", "bot");
    return;
  }

  const p = products.find(x => x.id === id);
  if (!p) {
    addMessageText(`Không thấy sản phẩm ID ${id}. Gõ “danh sách” để xem tất cả.`, "bot");
    return;
  }

  // Trả lời kèm ảnh (HTML)
  addMessageHTML(
    `<div style="font-weight:600;margin-bottom:6px">${esc(p.name)}</div>
     <img src="${escAttr(p.img)}" alt="${escAttr(p.name)}"
          style="width:100%;max-height:160px;object-fit:cover;border-radius:6px;margin:6px 0">
     <div style="margin-bottom:6px">${esc(p.desc || "Mô tả đang cập nhật.")}</div>
     <div><strong>${esc(p.price)}</strong></div>`
  );
}

// Helpers hiển thị
function addMessageText(text, sender = "bot") {
  const box = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerText = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
function addMessageHTML(html) {
  const box = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = "message bot";
  div.innerHTML = html;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function escAttr(s){return String(s).replace(/"/g,"&quot;");}
