import { Metadata } from "next";
import CurrencyExchangeView from "@/components/currency/CurrencyExchangeView";

export const metadata: Metadata = {
  title: "Currency Exchange",
  description: "View currency rates and exchange currencies",
};

export default function CurrencyExchangePage() {
  return <CurrencyExchangeView />;
}