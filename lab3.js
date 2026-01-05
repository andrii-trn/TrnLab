const DATA_URL = "https://knureigs.github.io/itech/lb/ITech1_JS/ITech1_LabJS_meteo_kh.htm";

const btn = document.getElementById("btn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

function normalizeNumberStr(s) {
  if (s.startsWith("-.")) return s.replace("-.", "-0.");
  if (s.startsWith(".")) return "0" + s;
  return s;
}

function parseLine(line) {
  const dateMatch = line.match(/\d{4}-\d{2}-\d{2}/);
  if (!dateMatch) return null;

  const date = dateMatch[0];
  const afterDate = line.slice(dateMatch.index + date.length).trim();

  const numMatch = afterDate.match(/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)/);
  if (!numMatch) return null;

  const tmpStr = normalizeNumberStr(numMatch[0]);
  const tmp = parseFloat(tmpStr);
  if (Number.isNaN(tmp)) return null;

  return { date, tmp };
}

async function findHottestDay() {
  statusEl.textContent = "Завантажую дані...";
  resultEl.textContent = "";

  const resp = await fetch(DATA_URL);
  if (!resp.ok) throw new Error("HTTP " + resp.status);

  const html = await resp.text();

  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = (doc.querySelector("pre")?.innerText || doc.body.innerText || "").trim();

  if (!text) {
    throw new Error("Не вдалося витягнути текст з даними (pre/body порожні).");
  }

  statusEl.textContent = "Шукаю максимальний TMPMAX...";

  const lines = text.split(/\r?\n/);

  let best = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("STATION_ID")) continue;

    const rec = parseLine(line);
    if (!rec) continue;

    if (best === null || rec.tmp > best.tmp) best = rec;
  }

  if (!best) {
    resultEl.textContent = "Не знайшов валідних даних TMPMAX.";
    statusEl.textContent = "";
    return;
  }

  statusEl.textContent = "Готово";
  resultEl.textContent = `Найспекотніший день: ${best.date}, TMPMAX = ${best.tmp} °C`;
}

btn.addEventListener("click", () => {
  findHottestDay().catch((e) => {
    statusEl.textContent = "Помилка";
    resultEl.textContent = e.message;
  });
});
