import { useState, useEffect, useCallback, useRef } from "react";
import { Asset } from "expo-asset";
import type { ExtractedPage } from "@/data/flowsimulator";

// Module-level cache: persists for the app session
const pageCache = new Map<number, string>();
let cachedPdfUri: string | null = null;

// Dynamically import to avoid crashes when native module isn't available
let PdfExtract: typeof import("expo-pdf-text-extract") | null = null;
try {
  PdfExtract = require("expo-pdf-text-extract");
} catch {
  // Native module not available (e.g., Expo Go)
}

async function ensurePdfUri(): Promise<string> {
  if (cachedPdfUri) return cachedPdfUri;
  const asset = Asset.fromModule(
    require("@/assets/A350___Tutorials.pdf")
  );
  await asset.downloadAsync();
  cachedPdfUri = asset.localUri ?? asset.uri;
  return cachedPdfUri;
}

interface UsePdfExtractionResult {
  pages: ExtractedPage[];
  loading: boolean;
  progress: number; // 0 to 1
  error: string | null;
  totalPages: number;
  extractedCount: number;
  available: boolean;
}

export function usePdfExtraction(
  startPage: number,
  endPage: number
): UsePdfExtractionResult {
  const [pages, setPages] = useState<ExtractedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [available, setAvailable] = useState(true);
  const abortRef = useRef(false);

  const totalPages = endPage - startPage + 1;
  const extractedCount = pages.length;

  useEffect(() => {
    abortRef.current = false;

    async function extract() {
      // Check if native module is available
      if (!PdfExtract || !PdfExtract.isAvailable()) {
        setAvailable(false);
        setLoading(false);
        setError(
          "PDF extraction requires a development build. Run: npx expo run:ios"
        );
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const uri = await ensurePdfUri();
        const result: ExtractedPage[] = [];

        // Check cache first, extract only what's missing
        for (let p = startPage; p <= endPage; p++) {
          if (abortRef.current) return;

          let text = pageCache.get(p);
          if (!text) {
            text = await PdfExtract!.extractTextFromPage(uri, p);
            pageCache.set(p, text);
          }

          result.push({ pageNumber: p, text });
          setProgress((p - startPage + 1) / totalPages);
          // Update pages incrementally so UI shows progress
          setPages([...result]);
        }

        setLoading(false);
      } catch (err) {
        if (!abortRef.current) {
          setError(
            err instanceof Error ? err.message : "Failed to extract PDF"
          );
          setLoading(false);
        }
      }
    }

    extract();

    return () => {
      abortRef.current = true;
    };
  }, [startPage, endPage]);

  return { pages, loading, progress, error, totalPages, extractedCount, available };
}

/** Extract a single page (for on-demand use outside the hook) */
export async function extractSinglePage(
  pageNumber: number
): Promise<string | null> {
  if (!PdfExtract || !PdfExtract.isAvailable()) return null;

  const cached = pageCache.get(pageNumber);
  if (cached) return cached;

  const uri = await ensurePdfUri();
  const text = await PdfExtract.extractTextFromPage(uri, pageNumber);
  pageCache.set(pageNumber, text);
  return text;
}
