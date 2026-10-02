import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { validateImage } from "@/lib/validation";
import { z } from "zod";
const schema = z.object({
  bucket: z.enum(["gallery", "event-posters", "site-assets"]),
  type: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size: z
    .number()
    .int()
    .min(1)
    .max(10 * 1024 * 1024),
});
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin)
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const admin = await getAdmin();
  if (!admin)
    return NextResponse.json(
      { error: "Administrator sign-in required." },
      { status: 401 },
    );
  try {
    const data = schema.parse(await request.json());
    validateImage(data);
    const ext = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    }[data.type];
    const path = `${admin.user.id}/${crypto.randomUUID()}.${ext}`;
    const { data: signed, error } = await admin.supabase.storage
      .from(data.bucket)
      .createSignedUploadUrl(path);
    if (error) throw error;
    return NextResponse.json({ path, signedUrl: signed.signedUrl });
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to prepare upload. Use a JPG, PNG or WebP image up to 10 MB.",
      },
      { status: 400 },
    );
  }
}
export async function PUT(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin)
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const admin = await getAdmin();
  if (!admin)
    return NextResponse.json(
      { error: "Administrator sign-in required." },
      { status: 401 },
    );
  try {
    const data = z
      .object({
        bucket: z.enum(["gallery", "event-posters", "site-assets"]),
        path: z.string().max(500),
      })
      .parse(await request.json());
    if (
      !new RegExp(`^${admin.user.id}/[a-f0-9-]+\\.(jpg|png|webp)$`).test(
        data.path,
      )
    )
      throw new Error("Invalid upload path.");
    const storage = admin.supabase.storage.from(data.bucket);
    const { data: blob, error } = await storage.download(data.path);
    if (error || !blob) throw new Error("Unable to verify upload.");
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const png =
      bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
    const jpg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    const webp =
      new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
    const correct =
      (data.path.endsWith(".png") && png) ||
      (data.path.endsWith(".jpg") && jpg) ||
      (data.path.endsWith(".webp") && webp);
    if (!correct || blob.size > 10 * 1024 * 1024) {
      await storage.remove([data.path]);
      throw new Error("The file contents are not a supported image.");
    }
    return NextResponse.json({
      path: data.path,
      url: storage.getPublicUrl(data.path).data.publicUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Upload verification failed.",
      },
      { status: 400 },
    );
  }
}
