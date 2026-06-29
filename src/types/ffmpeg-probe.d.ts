declare module "ffmpeg-probe" {
  interface ProbeResult {
    duration?: number;
    width?: number;
    height?: number;
    fps?: number;
    format?: { duration?: string };
    streams?: { duration?: string; codec_type?: string }[];
  }

  function probe(input: string, opts?: string[]): Promise<ProbeResult>;
  export = probe;
}
