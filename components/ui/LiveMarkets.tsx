"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

// Market Data Interface
interface PairDef {
  symbol: string;
  name: string;
  type: "forex" | "crypto";
  tvSymbol: string;
  tvMarket: "crypto" | "forex" | "cfd";
  coinId?: string;
  baseFlag?: string;
  quoteFlag?: string;
  yahooSymbol?: string;
}

interface MarketData extends PairDef {
  price: number;
  change: number;
  changePercent: number;
  image?: string;
  sparkline: number[];
}

// 20 mixed pairs: crypto and forex alternated
const PAIRS: PairDef[] = [
  // Crypto
  {
    symbol: "BTC/USD",
    name: "Bitcoin",
    type: "crypto",
    tvSymbol: "BINANCE:BTCUSDT",
    tvMarket: "crypto",
    coinId: "bitcoin",
  },
  // Forex
  {
    symbol: "XAUUSD",
    name: "Gold vs US Dollar",
    type: "forex",
    tvSymbol: "TVC:GOLD",
    tvMarket: "cfd",
    yahooSymbol: "GC=F",
  },
  // Crypto
  {
    symbol: "ETH/USD",
    name: "Ethereum",
    type: "crypto",
    tvSymbol: "BINANCE:ETHUSDT",
    tvMarket: "crypto",
    coinId: "ethereum",
  },
  // Forex
  {
    symbol: "EURUSD",
    name: "Euro vs US Dollar",
    type: "forex",
    tvSymbol: "FX:EURUSD",
    tvMarket: "forex",
    baseFlag: "eu",
    quoteFlag: "us",
    yahooSymbol: "EURUSD=X",
  },
  // Crypto
  {
    symbol: "BNB/USD",
    name: "Binance Coin",
    type: "crypto",
    tvSymbol: "BINANCE:BNBUSDT",
    tvMarket: "crypto",
    coinId: "binancecoin",
  },
  // Forex
  {
    symbol: "GBPUSD",
    name: "British Pound vs US Dollar",
    type: "forex",
    tvSymbol: "FX:GBPUSD",
    tvMarket: "forex",
    baseFlag: "gb",
    quoteFlag: "us",
    yahooSymbol: "GBPUSD=X",
  },
  // Crypto
  {
    symbol: "SOL/USD",
    name: "Solana",
    type: "crypto",
    tvSymbol: "BINANCE:SOLUSDT",
    tvMarket: "crypto",
    coinId: "solana",
  },
  // Forex
  {
    symbol: "USDJPY",
    name: "US Dollar vs Japanese Yen",
    type: "forex",
    tvSymbol: "FX:USDJPY",
    tvMarket: "forex",
    baseFlag: "us",
    quoteFlag: "jp",
    yahooSymbol: "USDJPY=X",
  },
  // Crypto
  {
    symbol: "ADA/USD",
    name: "Cardano",
    type: "crypto",
    tvSymbol: "BINANCE:ADAUSDT",
    tvMarket: "crypto",
    coinId: "cardano",
  },
  // Forex
  {
    symbol: "AUDUSD",
    name: "Australian Dollar vs US Dollar",
    type: "forex",
    tvSymbol: "FX:AUDUSD",
    tvMarket: "forex",
    baseFlag: "au",
    quoteFlag: "us",
    yahooSymbol: "AUDUSD=X",
  },
  // Crypto
  {
    symbol: "XRP/USD",
    name: "Ripple",
    type: "crypto",
    tvSymbol: "BINANCE:XRPUSDT",
    tvMarket: "crypto",
    coinId: "ripple",
  },
  // Forex
  {
    symbol: "USDCAD",
    name: "US Dollar vs Canadian Dollar",
    type: "forex",
    tvSymbol: "FX:USDCAD",
    tvMarket: "forex",
    baseFlag: "us",
    quoteFlag: "ca",
    yahooSymbol: "USDCAD=X",
  },
  // Crypto
  {
    symbol: "DOGE/USD",
    name: "Dogecoin",
    type: "crypto",
    tvSymbol: "BINANCE:DOGEUSDT",
    tvMarket: "crypto",
    coinId: "dogecoin",
  },
  // Forex
  {
    symbol: "NZDUSD",
    name: "New Zealand Dollar vs US Dollar",
    type: "forex",
    tvSymbol: "FX:NZDUSD",
    tvMarket: "forex",
    baseFlag: "nz",
    quoteFlag: "us",
    yahooSymbol: "NZDUSD=X",
  },
  // Crypto
  {
    symbol: "DOT/USD",
    name: "Polkadot",
    type: "crypto",
    tvSymbol: "BINANCE:DOTUSDT",
    tvMarket: "crypto",
    coinId: "polkadot",
  },
  // Forex
  {
    symbol: "USDCHF",
    name: "US Dollar vs Swiss Franc",
    type: "forex",
    tvSymbol: "FX:USDCHF",
    tvMarket: "forex",
    baseFlag: "us",
    quoteFlag: "ch",
    yahooSymbol: "USDCHF=X",
  },
  // Crypto
  {
    symbol: "TRXUSDT",
    name: "TRON",
    type: "crypto",
    tvSymbol: "BINANCE:TRXUSDT",
    tvMarket: "crypto",
    coinId: "tron",
  },
  // Forex
  {
    symbol: "EURGBP",
    name: "Euro vs British Pound",
    type: "forex",
    tvSymbol: "FX:EURGBP",
    tvMarket: "forex",
    baseFlag: "eu",
    quoteFlag: "gb",
    yahooSymbol: "EURGBP=X",
  },
  // Crypto
  {
    symbol: "AVAX/USD",
    name: "Avalanche",
    type: "crypto",
    tvSymbol: "BINANCE:AVAXUSDT",
    tvMarket: "crypto",
    coinId: "avalanche-2",
  },
  // Forex
  {
    symbol: "USDHKD",
    name: "US Dollar vs Hong Kong Dollar",
    type: "forex",
    tvSymbol: "FX:USDHKD",
    tvMarket: "forex",
    baseFlag: "us",
    quoteFlag: "hk",
    yahooSymbol: "USDHKD=X",
  },
];

const PRICE_POLL_MS = 20000;
const SPARKLINE_POLL_MS = 10 * 60 * 1000;

// Downsample a price series to at most ~60 points for rendering
const sampleSeries = (data: number[], maxPoints = 60): number[] => {
  const clean = data.filter((v) => typeof v === "number" && !Number.isNaN(v));
  if (clean.length <= maxPoints) return clean;
  const stride = Math.ceil(clean.length / maxPoints);
  const sampled: number[] = [];
  for (let i = 0; i < clean.length; i += stride) {
    sampled.push(clean[i]);
  }
  sampled.push(clean[clean.length - 1]);
  return sampled;
};

interface TvQuote {
  close: number;
  changeAbs: number;
  changePct: number;
}

export default function LiveMarkets() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [marketLoading, setMarketLoading] = useState(true);
  const [formattedTime, setFormattedTime] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch live prices + 24h change from TradingView Scanner API
  const fetchPrices = useCallback(async () => {
    const markets: Array<"crypto" | "forex" | "cfd"> = ["crypto", "forex", "cfd"];
    const results = await Promise.allSettled(
      markets.map((market) => {
        const tickers = PAIRS.filter((p) => p.tvMarket === market).map(
          (p) => p.tvSymbol,
        );
        if (tickers.length === 0) return Promise.resolve(null);
        return fetch(
          `/api/market?type=tv&market=${market}&symbols=${encodeURIComponent(tickers.join(","))}`,
        ).then((r) => r.json());
      }),
    );

    const quotes = new Map<string, TvQuote>();
    results.forEach((result) => {
      if (result.status !== "fulfilled" || !result.value?.data) return;
      result.value.data.forEach((item: { s: string; d: unknown[] }) => {
        const [name, close, open, changePct, changeAbs] = item.d as [
          string,
          number,
          number,
          number,
          number,
        ];
        if (typeof close !== "number") return;
        quotes.set(item.s, {
          close,
          changeAbs: typeof changeAbs === "number" ? changeAbs : close - (open ?? close),
          changePct: typeof changePct === "number" ? changePct : 0,
        });
      });
    });

    setMarketData((prev) =>
      prev.map((item) => {
        const quote = quotes.get(item.tvSymbol);
        if (!quote) return item;
        return {
          ...item,
          price: quote.close,
          change: quote.changeAbs,
          changePercent: quote.changePct,
        };
      }),
    );
  }, []);

  // Fetch real sparkline data: CoinGecko for crypto, Yahoo Finance for forex/metals
  const fetchSparklines = useCallback(async () => {
    const updates = new Map<string, { image?: string; sparkline: number[] }>();

    // Crypto: CoinGecko markets endpoint (logo + 7d sparkline in one call)
    const cryptoPairs = PAIRS.filter((p) => p.type === "crypto" && p.coinId);
    try {
      const coinIds = cryptoPairs.map((p) => p.coinId).join(",");
      const res = await fetch(
        `/api/market?type=coingecko&ids=${encodeURIComponent(coinIds)}`,
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach((coin: any) => {
          updates.set(coin.id, {
            image: coin.image || "",
            sparkline: sampleSeries(coin.sparkline_in_7d?.price ?? []),
          });
        });
      }
    } catch (error) {
      console.error("Error fetching crypto sparklines:", error);
    }

    // Forex/metals: Yahoo Finance chart API (hourly closes, last day)
    const forexPairs = PAIRS.filter((p) => p.yahooSymbol);
    await Promise.allSettled(
      forexPairs.map(async (pair) => {
        try {
          const res = await fetch(
            `/api/market?type=yahoo&symbol=${encodeURIComponent(pair.yahooSymbol!)}`,
          );
          const json = await res.json();
          const closes: number[] =
            json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];
          updates.set(pair.symbol, {
            sparkline: sampleSeries(closes),
          });
        } catch (error) {
          console.error(`Error fetching sparkline for ${pair.symbol}:`, error);
        }
      }),
    );

    setMarketData((prev) =>
      prev.map((item) => {
        const update = item.coinId
          ? updates.get(item.coinId)
          : updates.get(item.symbol);
        if (!update) return item;
        return { ...item, ...update };
      }),
    );
  }, []);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.allSettled([fetchPrices(), fetchSparklines()]);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchPrices, fetchSparklines]);

  useEffect(() => {
    // Initialize pair list, then fetch live data
    setMarketData(PAIRS.map((p) => ({ ...p, price: 0, change: 0, changePercent: 0, sparkline: [] })));

    fetchPrices().finally(() => setMarketLoading(false));
    fetchSparklines();

    // Update clock every second
    const updateTime = () => {
      setFormattedTime(new Date().toLocaleTimeString());
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Poll live prices from TradingView
    const priceInterval = setInterval(fetchPrices, PRICE_POLL_MS);

    // Refresh sparkline series periodically
    const sparklineInterval = setInterval(fetchSparklines, SPARKLINE_POLL_MS);

    return () => {
      clearInterval(timeInterval);
      clearInterval(priceInterval);
      clearInterval(sparklineInterval);
    };
  }, [fetchPrices, fetchSparklines]);

  // Refresh function
  const refreshMarketData = refreshAll;

  const formatPrice = (price: number, type: "forex" | "crypto") => {
    if (!price) return "—";
    if (type === "crypto") {
      return price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    if (price >= 100) return price.toFixed(3);
    if (price >= 10) return price.toFixed(4);
    return price.toFixed(5);
  };

  const formatChange = (change: number, type: "forex" | "crypto") => {
    const isPositive = change >= 0;
    const value = type === "crypto"
      ? change.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : Math.abs(change) < 1
        ? change.toFixed(5)
        : Math.abs(change) < 10
          ? change.toFixed(4)
          : change.toFixed(3);
    return (
      <div className={`flex items-center gap-1 whitespace-nowrap justify-end ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? (
          <TrendingUp className="w-3 h-3 flex-shrink-0" />
        ) : (
          <TrendingDown className="w-3 h-3 flex-shrink-0" />
        )}
        <span className="font-medium text-xs">{value}</span>
      </div>
    );
  };

  const formatChangePercent = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return (
      <div className={`flex items-center gap-1 whitespace-nowrap justify-end ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? (
          <TrendingUp className="w-3 h-3 flex-shrink-0" />
        ) : (
          <TrendingDown className="w-3 h-3 flex-shrink-0" />
        )}
        <span className="font-medium text-xs">
          {isPositive ? "+" : ""}
          {changePercent.toFixed(2)}%
        </span>
      </div>
    );
  };

  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-8 pt-10 lg:pt-15 w-full relative">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-2 lg:gap-4">
          {/* Left */}
          <div>
            <h2 className="text-3xl md:text-3xl font-bold">
              Live Markets
            </h2>
            <p className="text-muted-foreground max-w-lg text-base md:text-lg">
              Real-time cryptocurrency and forex prices with live updates
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground md:self-end">
            <RefreshCw className="w-4 h-4 animate-spin text-primary" />
            <span>Last Update: {formattedTime}</span>
          </div>
        </div>

        {/* Market Data Table */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-0 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header Row */}
              <div className="flex justify-between items-center bg-muted/50 border-b border-border px-6 py-4">
                <div className="flex-[1.4] text-[11px] font-black uppercase tracking-widest text-muted-foreground">Symbol</div>
                <div className="flex-1 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground">Last</div>
                <div className="flex-1 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground">Chg</div>
                <div className="flex-1 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground">Chg%</div>
                <div className="flex-1 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground">Type</div>
              </div>

              {/* Data Rows */}
              <div className="divide-y divide-border/50">
                {marketLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center px-6 py-4 animate-pulse">
                        <div className="flex-[1.4] h-4 bg-muted rounded w-32"></div>
                        <div className="flex-1 h-4 bg-muted rounded w-20 ml-auto"></div>
                        <div className="flex-1 h-4 bg-muted rounded w-16 ml-auto"></div>
                        <div className="flex-1 h-4 bg-muted rounded w-16 ml-auto"></div>
                        <div className="flex-1 h-4 bg-muted rounded w-10 ml-auto"></div>
                      </div>
                    ))
                  : marketData.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center px-6 py-4 hover:bg-muted/30 transition-colors flex-nowrap"
                      >
                        {/* Asset */}
                        <div className="flex-[1.4] flex items-center gap-3 min-w-0">
                          <div className="relative flex-shrink-0">
                            {item.type === "crypto" ? (
                              // Crypto logos
                              item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-8 h-8 rounded-full object-cover border border-border"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
                                  <span className="text-[10px] font-black text-orange-500">{item.symbol.slice(0, 2)}</span>
                                </div>
                              )
                            ) : (
                              // Forex flags
                              <div className="flex -space-x-2">
                                {item.baseFlag && (
                                  <img
                                    src={`https://flagcdn.com/${item.baseFlag}.svg`}
                                    alt="Base currency"
                                    className="w-6 h-6 rounded-full object-cover border-2 border-background"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                )}
                                {item.quoteFlag && (
                                  <img
                                    src={`https://flagcdn.com/${item.quoteFlag}.svg`}
                                    alt="Quote currency"
                                    className="w-6 h-6 rounded-full object-cover border-2 border-background"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                )}
                                {(!item.baseFlag || !item.quoteFlag) && (
                                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                                    <span className="text-[10px] font-black text-blue-500">{item.symbol.slice(0, 2)}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="truncate">
                            <div className="font-black text-sm uppercase tracking-tighter leading-none">{item.symbol}</div>
                            <div className="text-[10px] text-muted-foreground font-medium truncate">{item.name}</div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex-1 text-right">
                          <div className="font-bold text-sm tracking-tight">
                            {formatPrice(item.price, item.type)}
                          </div>
                        </div>

                        {/* Chg */}
                        <div className="flex-1 text-right">
                          <div className="inline-block">
                            {formatChange(item.change, item.type)}
                          </div>
                        </div>

                        {/* Chg% */}
                        <div className="flex-1 text-right">
                          <div className="inline-block">
                            {formatChangePercent(item.change, item.changePercent)}
                          </div>
                        </div>

                        {/* Type */}
                        <div className="flex-1 flex justify-end">
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${
                            item.type === "crypto"
                              ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }`}>
                            {item.type}
                          </span>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
