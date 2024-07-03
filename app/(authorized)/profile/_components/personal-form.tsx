"use client";

import { useMeQuery } from "@/lib/store/slices/me";

export default function PersonalForm() {
  const me = useMeQuery(undefined);
  return <div></div>;
}
