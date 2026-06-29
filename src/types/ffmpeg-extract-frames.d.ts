declare module "ffmpeg-extract-frames" {
  interface ExtractFramesOptions {
    input: string;
    output: string;
    timestamps?: number[];
    offsets?: number[];
    fps?: number;
    numFrames?: number;
    ffmpegPath?: string;
    log?: (info: { cmd: string }) => void;
  }

  function extractFrames(options: ExtractFramesOptions): Promise<string>;
  export = extractFrames;
}
