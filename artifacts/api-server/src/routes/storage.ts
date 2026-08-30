import { Readable } from "stream";
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from "@workspace/api-zod";
import { Router, type IRouter, type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  ObjectNotFoundError,
  ObjectStorageService,
} from "../lib/objectStorage.js";

const router: IRouter = Router();
const objectStorage = new ObjectStorageService();

router.post(
  "/storage/uploads/request-url",
  requireAuth,
  async (req: Request, res: Response) => {
    const parsed = RequestUploadUrlBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Please choose a JPG, PNG, WebP, or GIF image under 10 MB." });
      return;
    }

    try {
      const uploadURL = await objectStorage.getObjectEntityUploadURL();
      const objectPath = objectStorage.normalizeObjectEntityPath(uploadURL);
      res.json(
        RequestUploadUrlResponse.parse({
          uploadURL,
          objectPath,
          metadata: parsed.data,
        }),
      );
    } catch (error) {
      req.log.error({ err: error }, "Failed to generate image upload URL");
      res.status(500).json({ error: "Failed to prepare image upload" });
    }
  },
);

router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const rawPath = req.params.path;
    const wildcardPath = Array.isArray(rawPath) ? rawPath.join("/") : rawPath;
    const file = await objectStorage.getObjectEntityFile(`/objects/${wildcardPath}`);
    const response = await objectStorage.downloadObject(file);

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (!response.body) {
      res.end();
      return;
    }

    Readable.fromWeb(
      response.body as ReadableStream<Uint8Array>,
    ).pipe(res);
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Image not found" });
      return;
    }
    req.log.error({ err: error }, "Failed to serve stored image");
    res.status(500).json({ error: "Failed to serve image" });
  }
});

export default router;