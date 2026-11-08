import { NextRequest, NextResponse } from "next/server";

// Proxy for public market-data APIs that block or lack CORS headers
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  const symbol = req.nextUrl.searchParams.get("symbol");
  const ids = req.nextUrl.searchParams.get("ids");
  const tvMarket = req.nextUrl.searchParams.get("market");
  const tvSymbols = req.nextUrl.searchParams.get("symbols");

  if (type === "tv" && tvMarket && tvSymbols) {
    const tickers = tvSymbols.split(",").filter(Boolean).slice(0, 100);
    if (tickers.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    try {
      const res = await fetch(`https://scanner.tradingview.com/${tvMarket}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          columns: ["name", "close", "open", "change", "change_abs"],
          symbols: { tickers, query: { types: [] } },
          range: [0, tickers.length],
        }),
        cache: "no-store",
      });
      if (!res.ok) {
        return NextResponse.json(
          { error: `Upstream returned ${res.status}` },
          { status: res.status },
        );
      }
      return NextResponse.json(await res.json());
    } catch (e) {
      console.error("GET /api/market tv error", e);
      return NextResponse.json({ error: "Failed to fetch market data" }, { status: 502 });
    }
  }

  let url: string;
  if (type === "yahoo" && symbol) {
    url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1h&range=1d`;
  } else if (type === "coingecko" && ids) {
    url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(ids)}&order=market_cap_desc&per_page=20&page=1&sparkline=true`;
  } else {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: res.status },
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("GET /api/market error", e);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 502 });
  }
}
