import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Link from "next/link";
import A from "@mui/material/Link";
import Logo from "@/lib/components/logo-cut";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/feed");
  }

  return (
    <Container>
      <Stack alignItems="center" spacing={4} useFlexGap>
        <Box sx={{ width: 300 }}>
          <Logo />
        </Box>
        <A href="/auth" variant="h5" textTransform="uppercase" component={Link}>
          войти
        </A>
      </Stack>
    </Container>
  );
}
