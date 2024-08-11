"use client";

import Button from "@mui/material/Button";
import { unsubscribe } from "../actions";
import type { User } from "@/lib/schemas";
import { useCallback } from "react";

export default function UnsubscribeButton({
  subscription,
}: Readonly<{ subscription: User }>) {
  const onUnsubscribe = useCallback(async () => {
    await unsubscribe(subscription.id);
  }, [subscription]);

  return (
    <Button variant="contained" type="submit" onClick={onUnsubscribe}>
      отписаться
    </Button>
  );
}
