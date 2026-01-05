const DATA_URL = "https://knureigs.github.io/itech/lb/ITech1_JS/ITech1_LabJS_meteo_kh.htm";

const btn = document.getElementById("btn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

function normalizeNumberStr(s) {
  if (s.startsWith("-."))
    return s.replace("-.", "-0.");
  if (s.startsWith("."))
    return "0" + s;
  return s;
}

function parseLine(line) {
  const re = /(\d{4}-\d{2}-\d{2})\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))/;
  const m = line.match(re);
  if (!m) return null;

  const date = m[1];
  const tmpStr = normalizeNumberStr(m[2]);
  const tmp = parseFloat(tmpStr);

  if (Number.isNaN(tmp)) return null;

  return { date, tmp };
}

async function findHottestDay() {
  statusEl.textContent = "Завантажую дані...";
  resultEl.textContent = "";

  const resp = await fetch(DATA_URL, { method: "GET" });
  if (!resp.ok) throw new Error("Не вдалося завантажити дані: HTTP " + resp.status);

  const text = await resp.text();
  statusEl.textContent = "Обробляю рядки...";

  const lines = text.split(/\r?\n/);

  let best = null;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const rec = parseLine(line);
    if (!rec) continue;

    if (best === null || rec.tmp > best.tmp) {
      best = rec;
    }
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
