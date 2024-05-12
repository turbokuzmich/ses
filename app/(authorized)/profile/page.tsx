import { auth } from "@/lib/auth";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";

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
          <Stack spacing={2} useFlexGap>
            <TextField
              disabled
              label="Ник"
              size="small"
              autoComplete="false"
              value={session.user.name}
            />
            <TextField
              disabled
              label="Электронная почта"
              size="small"
              autoComplete="false"
              value={session.user.email}
            />
            <Button type="submit" variant="contained" size="large" disabled>
              Сохранить
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
