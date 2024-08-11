import { fetchSubscriptions } from "@/lib/api";
import { auth } from "@/lib/auth";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import UnsubscribeButton from "./_components/unsubscribe";
import stc from "string-to-color";

export default async function Subscriptions() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const subscriptions = await fetchSubscriptions(session.user.token);

  if (!subscriptions.length) {
    return <Typography>У вас пока нет друзей.</Typography>;
  }

  return (
    <Stack gap={2} useFlexGap>
      {subscriptions.map((subscription) => {
        return (
          <Card key={subscription.id}>
            <CardHeader
              avatar={
                <Avatar
                  alt={subscription.name}
                  sx={{ bgcolor: stc(subscription.name) }}
                >
                  {subscription.name.charAt(0).toUpperCase()}
                </Avatar>
              }
              title={subscription.name}
              action={<UnsubscribeButton subscription={subscription} />}
              sx={{
                ".MuiCardHeader-action": {
                  m: 0,
                  alignSelf: "initial",
                },
              }}
            />
          </Card>
        );
      })}
    </Stack>
  );
}
