import { auth } from "@/lib/auth";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import PersonalForm from "./_components/personal-form";

export default async function Profile() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <>
      <Typography variant="h4">Личные данные</Typography>
      <Grid container>
        <Grid xs={12} md={6}>
          <PersonalForm />
        </Grid>
      </Grid>
    </>
  );
}
