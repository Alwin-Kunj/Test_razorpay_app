"use client";

import { useEffect, useMemo, useState } from "react";
import type { Transaction, TransactionStatus } from "@/types/transaction";

type SortField = "createdAt" | "amountInPaise" | "customerName" | "id";

export default function Home() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [sort, setSort] = useState<string>("-createdAt");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (status) params.set("status", status);
      if (method) params.set("method", method);
      if (sort) params.set("sort", sort);
      const url = "/api/transactions" + (params.size ? `?${params.toString()}` : "");
      const res = await fetch(url, { signal: controller.signal });
      const json = await res.json();
      setItems(json.items as Transaction[]);
      setLoading(false);
    }
    load();
    return () => controller.abort();
  }, [query, status, method, sort]);

  const totalAmount = useMemo(
    () => items.reduce((sum, t) => sum += t.amountInPaise, 0) / 100,
    [items]
  );

  function handleSort(field: SortField) {
    const isSame = sort.replace("-", "") === field;
    const isDesc = sort.startsWith("-");
    const next = isSame && isDesc ? field : `-${field}`;
    setSort(next);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded p-4">
          <div className="text-sm text-gray-500">Total Transactions</div>
          <div className="text-2xl font-semibold">{items.length}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded p-4">
          <div className="text-sm text-gray-500">Total Amount</div>
          <div className="text-2xl font-semibold">₹{totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded p-4">
          <div className="text-sm text-gray-500">Status</div>
          <div className="text-2xl font-semibold">Live</div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded">
        <div className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID or customer"
              className="w-64 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-zinc-500"
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded px-3 py-2 text-sm">
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded px-3 py-2 text-sm">
              <option value="">All Methods</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Netbanking</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">{loading ? "Loading..." : `${items.length} results`}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-950 border-t border-b border-gray-200 dark:border-zinc-800">
              <tr>
                <th className="text-left px-4 py-2 cursor-pointer" onClick={() => handleSort("id")}>ID</th>
                <th className="text-left px-4 py-2 cursor-pointer" onClick={() => handleSort("customerName")}>Customer</th>
                <th className="text-left px-4 py-2">Method</th>
                <th className="text-left px-4 py-2 cursor-pointer" onClick={() => handleSort("amountInPaise")}>Amount</th>
                <th className="text-left px-4 py-2">Currency</th>
                <th className="text-left px-4 py-2 cursor-pointer" onClick={() => handleSort("createdAt")}>Created</th>
                <th className="text-left px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id} className="border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-950">
                  <td className="px-4 py-2 font-mono">{t.id}</td>
                  <td className="px-4 py-2">{t.customerName}</td>
                  <td className="px-4 py-2 uppercase">{t.method}</td>
                  <td className="px-4 py-2">₹{(t.amountInPaise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-2">{t.currency}</td>
                  <td className="px-4 py-2">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span className={
                      "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium " +
                      (t.status === "success"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        : t.status === "failed"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300")
                    }>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
