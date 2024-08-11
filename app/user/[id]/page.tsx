import { getPostsByUser, getUser, isSubscribed } from "@/lib/api";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import stc from "string-to-color";
import { DateTime } from "luxon";
import { type Session } from "next-auth";
import Button from "@mui/material/Button";
import { subscribe, unsubscribe } from "./actions";

export default async function User({
  params: { id },
}: Readonly<{ params: { id: string } }>) {
  const session = await auth();

  if (session?.user?.id === id) {
    return redirect("/profile");
  }

  const userId = parseInt(id, 10);
  const [user, posts] = await Promise.all([
    getUser(userId),
    getPostsByUser(userId),
  ]);

  if (!user) {
    return (
      <Container>
        <Typography>Пользователь не найден</Typography>
      </Container>
    );
  }

  const letter = user.name.charAt(0).toUpperCase();
  const color = stc(user.name);

  return (
    <Container>
      <Stack gap={2} useFlexGap>
        <Stack direction="row" gap={2} alignItems="center" useFlexGap>
          <Avatar
            alt={user.name}
            sx={{
              bgcolor: color,
              flexGrow: 0,
              flexShrink: 0,
            }}
          >
            {letter}
          </Avatar>
          <Typography variant="h6" flexGrow={1} flexShrink={1}>
            {user.name}
          </Typography>
          <SubscriptionButton id={userId} session={session} />
        </Stack>
        <Divider />
        <Stack gap={2} useFlexGap>
          {posts.map((post) => {
            const createdAt = DateTime.fromISO(post.createdAt).setLocale("ru");

            return (
              <Card key={post.id}>
                <CardHeader
                  avatar={
                    <Avatar alt={user.name} sx={{ bgcolor: color }}>
                      {letter}
                    </Avatar>
                  }
                  title={user.name}
                  subheader={`${createdAt.toLocaleString(
                    DateTime.DATE_MED
                  )} ${createdAt.toLocaleString(DateTime.TIME_24_SIMPLE)}`}
                />
                <CardContent>{post.text}</CardContent>
              </Card>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
}

async function SubscriptionButton({
  id,
  session,
}: Readonly<{ id: number; session: Session | null }>) {
  if (!session?.user) {
    return null;
  }

  const subscribed = await isSubscribed(id, session.user.token);

  return (
    <form action={subscribed ? unsubscribe : subscribe}>
      <input type="hidden" name="id" value={id} />
      <Button variant="contained" type="submit">
        {subscribed ? "Отписаться" : "Подписаться"}
      </Button>
    </form>
  );
}
