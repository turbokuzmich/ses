import { ReactNode } from "react";
import Stack from "@mui/material/Stack";
import ProfileTabs from "./_components/tabs";

export default function ProfileLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Stack direction="column" spacing={2} useFlexGap>
      <ProfileTabs />
      {children}
    </Stack>
  );
}
