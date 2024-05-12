"use client";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NotesIcon from "@mui/icons-material/Notes";
import CampaignIcon from "@mui/icons-material/Campaign";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { usePathname } from "next/navigation";

const config = [
  {
    path: "/feed",
    name: "Лента",
    icon: <NotesIcon />,
  },
  {
    path: "/announcements",
    name: "Анонсы",
    icon: <CampaignIcon />,
  },
  {
    path: "/profile",
    name: "Профиль",
    icon: <PersonIcon />,
  },
];

export default function Aside() {
  const pathname = usePathname();

  return (
    <List disablePadding>
      {config.map(({ path, name, icon }) => (
        <ListItem key={path} disablePadding>
          <ListItemButton
            href={path}
            LinkComponent={Link}
            selected={pathname.startsWith(path)}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
