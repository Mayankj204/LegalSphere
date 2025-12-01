// server/src/utils/blockchain.js
import { ethers } from "ethers";

const RPC = process.env.RPC_URL;
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const ABI = JSON.parse(process.env.CONTRACT_ABI_JSON || "[]");

let provider = null;
let wallet = null;
let contract = null;

try {
  provider = new ethers.JsonRpcProvider(RPC);
  wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
} catch (err) {
  console.log("Blockchain init skipped:", err.message);
}

export async function anchorToChain(fileHashHex, meta = "{}") {
  try {
    if (!contract) return null;

    const hash32 = fileHashHex.startsWith("0x") ? fileHashHex : "0x" + fileHashHex;

    const tx = await contract.anchorDocument(hash32, meta);
    const receipt = await tx.wait(1);

    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      chain: provider?._network?.name || "unknown",
    };
  } catch (err) {
    console.log("Blockchain anchor failed:", err.message);
    return null;
  }
}
