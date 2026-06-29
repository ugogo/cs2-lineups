import ffmpegStatic from "ffmpeg-static";

export interface ImportToolsStatus {
  ready: boolean;
}

export async function checkImportTools(): Promise<ImportToolsStatus> {
  return { ready: Boolean(ffmpegStatic) };
}

export const IMPORT_TOOLS_ERROR =
  "Tweet import dependencies are missing. Run npm install to install ffmpeg-static and related packages.";
