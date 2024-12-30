"use client";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { usePathname, useRouter } from "next/navigation";
import { SyntheticEvent, useCallback, useMemo } from "react";
import { type Role } from "@/lib/schemas";
import { meApi } from "@/lib/store/slices/me";

type Tab = { path: string; name: string; roles?: Role[] };

const config: Tab[] = [
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
    path: "/profile/music",
    name: "Музыка",
    roles: ["artist"],
  },
  {
    path: "/profile/favourites",
    name: "Избранное",
  },
];

export default function ProfileTabs() {
  const { push } = useRouter();
  const pathname = usePathname();
  const { data: user } = meApi.endpoints.fetchMe.useQuery();

  const tab = useMemo(
    () => config.findIndex(({ path }) => path === pathname),
    [pathname]
  );

  const tabs = useMemo<Tab[]>(() => {
    if (!user) {
      return [];
    }

    return config.filter((item) => {
      if (!item.roles) {
        return true;
      }

      return item.roles.includes(user.role);
    });
  }, [user]);

  const onTabChange = useCallback(
    (_: SyntheticEvent, value: number) => {
      push(config[value].path);
    },
    [push]
  );

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={tab} onChange={onTabChange}>
        {tabs.map(({ path, name }) => (
          <Tab key={path} label={name} />
        ))}
      </Tabs>
    </Box>
  );
}
