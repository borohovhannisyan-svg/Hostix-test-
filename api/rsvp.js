const ALLOWED_ORIGIN = "https://birthday-invite-mvp.borohovhannisyan.chatgpt.site";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const name = String(body.name || "").trim();
  const status = String(body.status || "").trim();
  const guests = String(body.guests || "").trim();
  const page = String(body.page || "onlyket.com/anibday").trim();

  if (!name || !status) {
    return res.status(400).json({ ok: false, error: "Name and status are required" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: "Email service is not configured" });
  }

  const subject = `[Անիի ծնունդ] ${status} — ${name}`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#17151a">
      <h2 style="margin:0 0 16px">Անիի ծննդյան հրավեր</h2>
      <p><strong>Անուն՝</strong> ${escapeHtml(name)}</p>
      <p><strong>Գործողություն՝</strong> ${escapeHtml(status)}</p>
      ${guests ? `<p><strong>Մանրամասներ՝</strong> ${escapeHtml(guests)}</p>` : ""}
      <p><strong>Էջ՝</strong> ${escapeHtml(page)}</p>
      <p style="color:#666;font-size:12px">${new Date().toISOString()}</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.RSVP_FROM_EMAIL || "OnlyKet RSVP <onboarding@resend.dev>",
      to: ["ani.mkhitaryan338@gmail.com"],
      subject,
      html
    })
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Resend error", response.status, result);
    return res.status(502).json({ ok: false, error: "Email delivery failed" });
  }

  return res.status(200).json({ ok: true });
};
