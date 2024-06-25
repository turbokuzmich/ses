"use client";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { usePathname, useRouter } from "next/navigation";
import { SyntheticEvent, useCallback, useMemo } from "react";

const config = [
  {
    path: "/profile",
    name: "Профиль",
  },
  {
    path: "/profile/posts",
    name: "Посты",
  },
  {
    path: "/profile/subscriptions",
    name: "Подписки",
  },
  {
    path: "/profile/favourites",
    name: "Избранное",
  },
];

export default function ProfileTabs() {
  const { push } = useRouter();
  const pathname = usePathname();

  const tab = useMemo(
    () => config.findIndex(({ path }) => path === pathname),
    [pathname]
  );

  const onTabChange = useCallback(
    (_: SyntheticEvent, value: number) => {
      push(config[value].path);
    },
    [push]
  );

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={tab} onChange={onTabChange}>
        {config.map(({ path, name }) => (
          <Tab key={path} label={name} />
        ))}
      </Tabs>
    </Box>
  );
}
