"use server";

import nacl from "tweetnacl";
import bs58 from "bs58";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";

const NONCE_STORE = new Map<string, string>();

export async function getNonce(publicKey: string) {
  const nonce = randomBytes(16).toString("hex");
  NONCE_STORE.set(publicKey, nonce);
  return nonce;
}

export async function verifySignature(publicKey: string, signature: string) {
  const nonce = NONCE_STORE.get(publicKey);
  if (!nonce) throw new Error("Nonce not found or expired");

  const verified = nacl.sign.detached.verify(
    new TextEncoder().encode(nonce),
    bs58.decode(signature),
    bs58.decode(publicKey)
  );

  if (!verified) throw new Error("Invalid signature");

  // Check if user exists
  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.solana_address, publicKey));

  // If not, create a new one
  if (!existingUser) {
    await db.insert(usersTable).values({
      solana_address: publicKey,
      fusd_balance: 100,
    });
  }

  NONCE_STORE.delete(publicKey);

  // Set a secure cookie with the wallet address
  (await cookies()).set("wallet-auth", publicKey, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { success: true, publicKey };
}

export async function logout() {
  (await cookies()).delete("wallet-auth");
  return { success: true };
}

export async function getCurrentUser() {
  const cookie = (await cookies()).get("wallet-auth");
  if (!cookie) return null;
  return cookie.value;
}
