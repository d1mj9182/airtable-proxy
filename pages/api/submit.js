export default async function handler(req, res) {
  // [CORS 허용] (이거 없으면 CORS 에러 무조건 남)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 환경변수 반드시 ""로 감쌀 것
  const API_KEY = "patsLgTBSt5CorHUB.5bb3ba67450d67ac9da759726724d4c3af2d3b8534c9b9aa595a331d382fba3b";
  const BASE_ID = "appCRfI2EJrLQJYBL";
  const TABLE_NAME = "당일민족1";

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
