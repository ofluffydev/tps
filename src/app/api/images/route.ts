import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const gallery = url.searchParams.get("gallery") || "kids";
  const imageDirectory = path.join(process.cwd(), "public", "images", "gallery", gallery);

  try {
    // Ensure the directory exists
    try {
      await fs.access(imageDirectory);
    } catch (error) {
      console.error("Directory does not exist, creating:", imageDirectory);
      await fs.mkdir(imageDirectory, { recursive: true });
    }

    const fileNames = await fs.readdir(imageDirectory);

    const imageFiles = fileNames.filter((file) => {
      const extension = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(extension);
    });

    const images = imageFiles.map((file) => ({
      src: `/images/gallery/${gallery}/${file}`,
      alt: `Image from the ${gallery} gallery, named ${file}`,
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error reading image directory:", error);
    return NextResponse.json(
      { error: "Unable to retrieve images", details: (error as Error).message },
      { status: 500 },
    );
  }
}
