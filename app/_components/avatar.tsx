"use client";

import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import NotesIcon from "@mui/icons-material/Notes";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import stc from "string-to-color";
import { useSession } from "next-auth/react";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { doSignOut } from "@/app/auth/actions";
import { useRouter } from "next/navigation";

export default function UserAvatar() {
  const { push } = useRouter();
  const { status, data } = useSession();

  const [avatarElement, setAvatarElement] = useState<HTMLAnchorElement | null>(
    null
  );

  const nickname = useMemo(() => data?.user?.name ?? "anonimous", [data]);
  const letter = useMemo(() => nickname.charAt(0).toUpperCase(), [nickname]);
  const color = useMemo(() => stc(nickname), [nickname]);

  const onAvatarClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      event.stopPropagation();

      setAvatarElement(event.currentTarget);
    },
    [setAvatarElement]
  );

  const onMenuClose = useCallback(() => {
    setAvatarElement(null);
  }, [setAvatarElement]);

  const onProfileGo = useCallback(() => {
    setAvatarElement(null);
    push("/profile");
  }, [push]);

  const onPostsGo = useCallback(() => {
    setAvatarElement(null);
    push("/profile/posts");
  }, [push]);

  const onSubscriptionsGo = useCallback(() => {
    setAvatarElement(null);
    push("/profile/subscriptions");
  }, [push]);

  const onFavouritesGo = useCallback(() => {
    setAvatarElement(null);
    push("/profile/favourites");
  }, [push]);

  const onSignout = useCallback(async () => {
    await doSignOut();
  }, []);

  return (
    <Box flexShrink={0}>
      {status === "authenticated" ? (
        <>
          <Avatar
            alt={nickname}
            sx={{ bgcolor: color, textDecoration: "none" }}
            component="a"
            href="/profile"
            onClick={onAvatarClick}
          >
            {letter}
          </Avatar>
          <Menu
            anchorEl={avatarElement}
            anchorOrigin={{ vertical: 45, horizontal: -170 }}
            open={Boolean(avatarElement)}
            onClose={onMenuClose}
            MenuListProps={{
              sx: {
                width: 230,
              },
            }}
          >
            <ListItem disablePadding>
              <ListItemButton
                href="/profile"
                LinkComponent={Link}
                onClick={onMenuClose}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Профиль</ListItemText>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                href="/profile/posts"
                LinkComponent={Link}
                onClick={onMenuClose}
              >
                <ListItemIcon>
                  <NotesIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Посты</ListItemText>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                href="/profile/subscriptions"
                LinkComponent={Link}
                onClick={onMenuClose}
              >
                <ListItemIcon>
                  <PeopleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Подписки</ListItemText>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                href="/profile/favourites"
                LinkComponent={Link}
                onClick={onMenuClose}
              >
                <ListItemIcon>
                  <FavoriteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Избранное</ListItemText>
              </ListItemButton>
            </ListItem>

            <Divider />

            <ListItem disablePadding>
              <ListItemButton onClick={onSignout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Выйти</ListItemText>
              </ListItemButton>
            </ListItem>
          </Menu>
        </>
      ) : null}
      {status === "unauthenticated" ? (
        <IconButton size="large" href="/auth" LinkComponent={Link}>
          <LoginIcon />
        </IconButton>
      ) : null}
      {status === "loading" ? <CircularProgress /> : null}
    </Box>
  );
}
