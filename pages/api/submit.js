export default async function handler(req, res) {
  const API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID = process.env.AIRTABLE_BASE_ID;
  const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

  if (!API_KEY || !BASE_ID || !TABLE_NAME) {
    return res.status(500).json({ error: "Airtable 환경변수 설정 필요" });
  }

  const AIRTABLE_API_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

  if (req.method === "POST") {
    try {
      const body = req.body;
      const airtableRes = await fetch(AIRTABLE_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: body }),
      });
      const data = await airtableRes.json();
      if (!airtableRes.ok) throw data;
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  if (req.method === "GET") {
    try {
      const airtableRes = await fetch(AIRTABLE_API_URL, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      const data = await airtableRes.json();
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  return res.status(405).json({ error: "허용되지 않는 요청" });
}

