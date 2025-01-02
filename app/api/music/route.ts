import { writeFile } from "fs/promises";
import { join } from "path";
import { zfd } from "zod-form-data";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";
import { updloadMusicFormSchema } from "@/lib/schemas";
import { auth } from "@/lib/auth";
import { createUpload, fetchMyMusic, processUpload } from "@/lib/api";

const schema = zfd
  .formData({
    title: zfd.text(),
    description: zfd.text(),
    file: zfd.file(),
  })
  .pipe(updloadMusicFormSchema);

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user?.token) {
    return Response.json({ error: "not authorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const result = await schema.safeParseAsync(formData);

  if (result.success) {
    const upload = await createUpload({
      title: result.data.title,
      description: result.data.description,
      token: session.user.token,
    });

    if (!upload) {
      return Response.json({ error: "upload not created" }, { status: 500 });
    }

    await writeFile(
      join(
        process.env.UPLOAD_PATH ?? join(process.cwd(), "uploads"),
        upload.path
      ),
      Readable.fromWeb(result.data.file.stream() as ReadableStream),
      { encoding: "binary" }
    );

    const isEnqueued = await processUpload(upload.id, session.user.token);

    return isEnqueued
      ? Response.json(upload)
      : Response.json({ error: "failed to process" }, { status: 500 });
  } else {
    return Response.json({ error: result.error.errors }, { status: 400 });
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.token) {
    return Response.json({ error: "not authorized" }, { status: 401 });
  }

  const music = await fetchMyMusic(session.user.token);

  if (music === null) {
    return Response.json({ error: "failed to fetch music" }, { status: 500 });
  }

  return Response.json(music);
}
