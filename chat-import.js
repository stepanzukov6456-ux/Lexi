// Shared contract for manual ChatGPT import and future AI adapters.
export function parseChatCards(text) {
  let raw = text.trim().replace(/^\uFEFF/, '');
  const fence = raw.match(/^```(?:json)?\s*\n([\s\S]*?)\n```\s*$/i);
  if (fence) raw = fence[1];
  let value;
  try { value = JSON.parse(raw); } catch { throw Error('Некорректный JSON. Скопируй ответ ChatGPT целиком.'); }
  const rows = Array.isArray(value) ? value : value && Array.isArray(value.cards) ? value.cards : [value];
  if (!rows.length || rows.length > 500) throw Error('Нужно от 1 до 500 карточек.');
  return rows.map((row, i) => {
    const fail = msg => { throw Error(`Карточка ${i+1}: ${msg}`); };
    if (!row || typeof row !== 'object' || Array.isArray(row)) fail('ожидается объект');
    const card = {};
    for (const key of ['term','definition','example','exampleTranslation']) {
      if (typeof row[key] !== 'string') fail(`поле ${key} должно быть текстом`);
      card[key] = row[key].trim();
    }
    if (!card.term || !card.definition) fail('термин и перевод обязательны');
    if (!Array.isArray(row.tags) || row.tags.some(t => typeof t !== 'string')) fail('tags должен быть массивом строк');
    card.tags = [...new Set(row.tags.map(t=>t.trim()).filter(Boolean))];
    return card;
  });
}
