"use client";

import { useState } from "react";
import { api } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  RefreshCw,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

export function GMCSyncPanel() {
  const [syncResult, setSyncResult] = useState<any | null>(null);
  const [copiedFeed, setCopiedFeed] = useState(false);

  const { data: status, isLoading, refetch } = api.googleMerchant.getStatus.useQuery(
    undefined,
    { staleTime: 30000 }
  );

  const syncAllMutation = api.googleMerchant.syncAllProducts.useMutation({
    onSuccess: (res) => {
      setSyncResult(res);
      if (res.mode === "api") {
        toast.success(`Successfully synced ${res.syncedVariants} variants to Google Merchant Center API!`);
      } else {
        toast.info(`Dry-Run validation complete! ${res.syncedVariants} variants validated for Google Merchant Center.`);
      }
      void refetch();
    },
    onError: (err) => {
      toast.error(`GMC Sync Failed: ${err.message}`);
    },
  });

  const handleCopyFeed = () => {
    if (!status?.feedUrl) return;
    navigator.clipboard.writeText(status.feedUrl);
    setCopiedFeed(true);
    toast.success("Google Shopping XML Feed URL copied to clipboard!");
    setTimeout(() => setCopiedFeed(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex items-center justify-center gap-3">
        <RefreshCw className="h-5 w-5 text-amber-500 animate-spin" />
        <span className="text-sm text-zinc-400">Loading Google Merchant Center status…</span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Google Merchant Center</h2>
              {status?.isConfigured ? (
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 text-[10px]">
                  <ShieldCheck className="h-3 w-3" /> Live API Connected
                </Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 text-[10px]">
                  <Zap className="h-3 w-3" /> Dry-Run / Feed Mode
                </Badge>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Sync products with Google Content API for Shopping & Google Shopping RSS Feeds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyFeed}
            className="border-white/10 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs gap-1.5"
          >
            {copiedFeed ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            Copy RSS Feed URL
          </Button>

          <Button
            size="sm"
            onClick={() => syncAllMutation.mutate()}
            disabled={syncAllMutation.isPending}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs gap-1.5 shadow-lg shadow-amber-500/10"
          >
            {syncAllMutation.isPending ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Syncing to Google…
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5 fill-current" /> Sync Products to GMC API
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-3.5">
          <div className="text-xs text-zinc-500 flex items-center gap-1">
            <Globe className="h-3.5 w-3.5 text-zinc-400" /> Merchant Account
          </div>
          <div className="text-sm font-semibold text-white mt-1">
            {status?.merchantId ? status.merchantId : "Sandbox (Not set)"}
          </div>
        </div>

        <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-3.5">
          <div className="text-xs text-zinc-500 flex items-center gap-1">
            <Tag className="h-3.5 w-3.5 text-zinc-400" /> Total Active Products
          </div>
          <div className="text-sm font-semibold text-white mt-1">{status?.totalProducts ?? 0} Products</div>
        </div>

        <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-3.5">
          <div className="text-xs text-zinc-500 flex items-center gap-1">
            <ShoppingBag className="h-3.5 w-3.5 text-zinc-400" /> Total Variant SKUs
          </div>
          <div className="text-sm font-semibold text-amber-400 mt-1">{status?.totalVariants ?? 0} SKUs</div>
        </div>

        <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-3.5">
          <div className="text-xs text-zinc-500 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> GMC Feed URL
          </div>
          <a
            href={status?.feedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-emerald-400 hover:underline mt-1 truncate flex items-center gap-1"
          >
            Open XML Feed <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Sync Execution Output */}
      {syncResult && (
        <div className="bg-zinc-950 border border-amber-500/20 rounded-xl p-4 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Sync Results ({syncResult.mode.toUpperCase()})
            </span>
            <span className="text-[10px] text-zinc-500">
              {new Date(syncResult.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-zinc-900/80 p-2 rounded border border-white/5">
              <div className="text-zinc-400">Products</div>
              <div className="text-sm font-bold text-white">{syncResult.totalProducts}</div>
            </div>
            <div className="bg-zinc-900/80 p-2 rounded border border-white/5">
              <div className="text-zinc-400">Total SKUs</div>
              <div className="text-sm font-bold text-amber-400">{syncResult.totalVariants}</div>
            </div>
            <div className="bg-zinc-900/80 p-2 rounded border border-white/5">
              <div className="text-zinc-400">Synced</div>
              <div className="text-sm font-bold text-emerald-400">{syncResult.syncedVariants}</div>
            </div>
          </div>

          {syncResult.errors && syncResult.errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 space-y-1">
              <div className="text-xs font-semibold text-red-400 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Validation / API Warnings ({syncResult.errors.length}):
              </div>
              <ul className="text-[11px] text-red-300 space-y-1 max-h-32 overflow-y-auto">
                {syncResult.errors.map((e: any, idx: number) => (
                  <li key={idx} className="font-mono">
                    <span className="font-bold">{e.sku}:</span> {e.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {syncResult.batchResults && syncResult.batchResults.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-zinc-400 font-medium">Validated SKUs Sample:</div>
              <div className="max-h-36 overflow-y-auto space-y-1 text-[11px] font-mono">
                {syncResult.batchResults.slice(0, 8).map((item: any, idx: number) => (
                  <div key={idx} className="bg-zinc-900 p-1.5 rounded flex items-center justify-between text-zinc-300">
                    <span className="truncate max-w-[240px]">
                      <span className="text-amber-400 font-bold">{item.offerId}</span> - {item.title}
                    </span>
                    <span className="text-emerald-400 flex-shrink-0">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
