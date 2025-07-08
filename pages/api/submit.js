export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID = process.env.AIRTABLE_BASE_ID;
  const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

  if (!API_KEY || !BASE_ID || !TABLE_NAME) {
    return res.status(500).json({ 
      error: "Airtable 환경변수 설정 필요",
      code: "NO_ENV",
    });
  }

  const AIRTABLE_API_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

  if (req.method === "POST") {
  try {
    // Airtable 컬럼명(필드명)만 배열에 기입 (한글, 띄어쓰기 정확히)
    const allowedFields = [
      "접수일자",
      "고객명",
      "연락처",
      "통신사",
      "상품",
      "부가상품",
      "상담시간",
      "진행상황",
      "TV추가"
    ];
    const body = req.body;
    const fields = {};

    // allowedFields만 추출해서 fields 객체 생성
    for (const key of allowedFields) {
      if (body[key] !== undefined) fields[key] = body[key];
    }

    const airtableRes = await fetch(AIRTABLE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }) // allowedFields만 전달 (문제 없음)
    });

    const data = await airtableRes.json();
    if (!airtableRes.ok) throw data;

    return res.status(200).json(data);

  } catch (e) {
    // 에러 처리
  }
}
    // 에러 구조화 및 콘솔 출력
    const errorObj = {
      message: e?.message || (typeof e === 'string' ? e : JSON.stringify(e)),
      code: e?.code || e?.error || 'INTERNAL_ERROR',
      stack: e?.stack || null,
      raw: e,
    };
    console.error("API /api/submit POST error:", errorObj);
    return res.status(500).json(errorObj);
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
      const errorObj = {
        message: e?.message || (typeof e === 'string' ? e : JSON.stringify(e)),
        code: e?.code || e?.error || 'INTERNAL_ERROR',
        stack: e?.stack || null,
        raw: e,
      };
      console.error("API /api/submit GET error:", errorObj);
      return res.status(500).json(errorObj);
    }
  }

  return res.status(405).json({ error: "허용되지 않는 요청", code: "METHOD_NOT_ALLOWED" });
}
