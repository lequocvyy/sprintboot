import type { ShopRequestStatus } from "./types";

export function getShopRequestTone(status: ShopRequestStatus) {
  switch (status) {
    case "PENDING":
      return "warning";
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "danger";
    default:
      return "neutral";
  }
}