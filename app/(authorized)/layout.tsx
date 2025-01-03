import { auth } from "@/lib/auth";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Aside from "@/app/_components/aside";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthorizedLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await auth();

  if (!session) {
    redirect("/auth");
  }

  return (
    <Container>
      <Grid spacing={4} container>
        <Grid size={{ xs: 3 }}>
          <Aside />
        </Grid>
        <Grid size={{ xs: 9 }}>{children}</Grid>
      </Grid>
    </Container>
  );
}
