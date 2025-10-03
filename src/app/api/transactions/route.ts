import { NextResponse } from "next/server";
import type { Transaction } from "@/types/transaction";

function generateMockTransactions(count: number): Transaction[] {
  const customers = [
    "Aarav Sharma",
    "Diya Patel",
    "Vivaan Singh",
    "Anaya Gupta",
    "Arjun Kumar",
    "Isha Reddy",
    "Kabir Mehta",
    "Sara Khan",
    "Rohan Verma",
    "Meera Nair",
  ];
  const methods = ["card", "upi", "netbanking", "wallet"];
  const currencies = ["INR"];
  const statuses = ["success", "failed", "pending"] as const;

  const now = Date.now();

  return Array.from({ length: count }).map((_, i) => {
    const id = `txn_${(100000 + i).toString()}`;
    const amountInPaise = Math.floor(1000 + Math.random() * 500000); // ₹10 - ₹5000
    const currency = currencies[0];
    const customerName = customers[Math.floor(Math.random() * customers.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const createdAt = new Date(
      now - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)
    ).toISOString();
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return { id, amountInPaise, currency, customerName, method, createdAt, status };
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const status = searchParams.get("status");
  const method = searchParams.get("method");
  const sort = searchParams.get("sort") || "-createdAt"; // - means desc

  let data = generateMockTransactions(100);

  if (q) {
    data = data.filter((t) =>
      [t.id, t.customerName].some((v) => v.toLowerCase().includes(q))
    );
  }
  if (status) {
    data = data.filter((t) => t.status === status);
  }
  if (method) {
    data = data.filter((t) => t.method === method);
  }

  const [key, dir] = sort.startsWith("-")
    ? [sort.slice(1), -1]
    : [sort, 1];

  const sortKey = key as keyof Transaction;
  data.sort((a, b) => {
    const av = a[sortKey] as unknown as string | number;
    const bv = b[sortKey] as unknown as string | number;
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  return NextResponse.json({ items: data });
}



