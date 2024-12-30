import { writeFile } from "fs/promises";
import { join } from "path";
import { zfd } from "zod-form-data";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";
import { updloadMusicFormSchema } from "@/lib/schemas";

const schema = zfd
  .formData({
    title: zfd.text(),
    description: zfd.text(),
    file: zfd.file(), // TODO validate file type with 'file-type' package
  })
  .pipe(updloadMusicFormSchema);

export async function PUT(request: Request) {
  const formData = await request.formData();
  const result = await schema.safeParseAsync(formData);

  if (result.success) {
    await writeFile(
      join(process.cwd(), "uploads", "upload.wav"),
      Readable.fromWeb(result.data.file.stream() as ReadableStream),
      { encoding: "binary" }
    );

    return Response.json({ success: true });
  } else {
    return Response.json(
      { success: false, errors: result.error.errors },
      { status: 400 }
    );
  }
}
