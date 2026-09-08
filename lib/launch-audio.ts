/** The upbeat launch excerpt and the reveal share one audio clock. */
export const LAUNCH_SECONDS = 30;
export const LAUNCH_TAIL_SECONDS = 32;
let cachedUrl = "";
let cachedMusic: Promise<ArrayBuffer> | undefined;

export function preloadLaunchMusic(url: string) {
  if (cachedUrl !== url || !cachedMusic) {
    cachedUrl = url;
    cachedMusic = fetch(url, { signal: AbortSignal.timeout(8000) }).then(response => {
      if (!response.ok) throw new Error("Launch music unavailable");
      return response.arrayBuffer();
    }).catch(error => { cachedMusic = undefined; throw error; });
  }
  return cachedMusic;
}

export class CountdownAudio {
  private context = new AudioContext();
  private output = this.context.createGain();
  private buffer: Promise<AudioBuffer>;
  private source?: AudioBufferSourceNode;
  private startedAt?: number;
  private closed = false;
  private pending = false;

  constructor(url: string) {
    this.output.gain.value = .75;
    this.output.connect(this.context.destination);
    this.buffer = preloadLaunchMusic(url).then(data => this.context.decodeAudioData(data.slice(0)));
    // A failed download is handled by enable/play; it must not block the website.
    void this.buffer.catch(() => {});
  }

  async enable() {
    await this.context.resume();
    if (this.closed) return;
    this.output.gain.setTargetAtTime(.75, this.context.currentTime, .025);
  }

  mute() { if (!this.closed) this.output.gain.setTargetAtTime(0, this.context.currentTime, .015); }

  async play(getElapsed: () => number) {
    if (this.source || this.pending || this.closed) return;
    this.pending = true;
    try {
      const buffer = await this.buffer;
      if (this.closed) return;
      const offset = getElapsed();
      if (offset >= LAUNCH_SECONDS) return;
      const at = this.context.currentTime;
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.output);
      source.start(at, offset);
      source.onended = () => source.disconnect();
      this.source = source;
      this.startedAt = at - offset;
      // Light ascending chimes mark the final five numbers on the music clock.
      [523.25, 659.25, 783.99, 880, 1046.5].forEach((frequency, index) => {
        const second = 25 + index;
        if (second < offset) return;
        const cueAt = at + second - offset;
        const tone = this.context.createOscillator();
        const envelope = this.context.createGain();
        tone.frequency.value = frequency;
        envelope.gain.setValueAtTime(0, cueAt);
        envelope.gain.linearRampToValueAtTime(.09, cueAt + .012);
        envelope.gain.exponentialRampToValueAtTime(.001, cueAt + .24);
        tone.connect(envelope); envelope.connect(this.output);
        tone.start(cueAt); tone.stop(cueAt + .26);
        tone.onended = () => { tone.disconnect(); envelope.disconnect(); };
      });
    } finally { this.pending = false; }
  }

  elapsed() {
    return this.startedAt !== undefined && this.context.state === "running"
      ? this.context.currentTime - this.startedAt : undefined;
  }

  close() {
    this.closed = true;
    if (this.context.state !== "closed") void this.context.close().catch(() => {});
  }
}
