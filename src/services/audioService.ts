import { AudioPlaybackState, Ayah, Reciter } from '../types/quran';
import { RECITERS_LIST, getAyahAudioUrl } from '../data/recitersData';

type StateListener = (state: AudioPlaybackState) => void;

class QuranAudioManager {
  private audio: HTMLAudioElement | null = null;
  private currentAyahList: Ayah[] = [];
  private currentAyahIndex: number = -1;
  private listeners: Set<StateListener> = new Set();

  private state: AudioPlaybackState = {
    isPlaying: false,
    currentAyahNumber: null,
    currentAyahInSurah: null,
    currentSurahNumber: null,
    reciterId: 'husary', // Default to Sheikh Mahmoud Khalil Al-Husary (Master of Tajweed)
    playbackSpeed: 1.0,
    repeatMode: 'once',
    currentRepeatCount: 0,
    progress: 0,
    currentTime: 0,
    duration: 0,
    autoPlayNext: true,
    isLoading: false
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private initAudio() {
    this.audio = new Audio();
    this.audio.preload = 'auto';

    this.audio.addEventListener('play', () => {
      this.state.isPlaying = true;
      this.state.isLoading = false;
      this.notify();
    });

    this.audio.addEventListener('pause', () => {
      this.state.isPlaying = false;
      this.notify();
    });

    this.audio.addEventListener('waiting', () => {
      this.state.isLoading = true;
      this.notify();
    });

    this.audio.addEventListener('canplay', () => {
      this.state.isLoading = false;
      this.notify();
    });

    this.audio.addEventListener('timeupdate', () => {
      if (!this.audio) return;
      const cur = this.audio.currentTime || 0;
      const dur = this.audio.duration || 1;
      this.state.currentTime = cur;
      this.state.duration = dur;
      this.state.progress = Math.min(1, Math.max(0, cur / dur));
      this.notify();
    });

    this.audio.addEventListener('ended', () => {
      this.handleAyahEnded();
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio playback error on ayah:', e);
      this.state.isPlaying = false;
      this.state.isLoading = false;
      this.notify();
    });
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach(fn => fn(s));
  }

  public getState(): AudioPlaybackState {
    return { ...this.state };
  }

  public setAyahList(ayahs: Ayah[]) {
    this.currentAyahList = ayahs;
  }

  public setReciter(reciterId: string) {
    this.state.reciterId = reciterId;
    this.notify();

    // If currently playing, reload audio with new reciter for current Ayah
    if (this.state.currentAyahNumber !== null && this.currentAyahIndex >= 0) {
      const wasPlaying = this.state.isPlaying;
      this.loadAyahByIndex(this.currentAyahIndex, wasPlaying);
    }
  }

  public setPlaybackSpeed(speed: number) {
    this.state.playbackSpeed = speed;
    if (this.audio) {
      this.audio.playbackRate = speed;
    }
    this.notify();
  }

  public setRepeatMode(mode: 'once' | 'twice' | 'thrice' | 'five' | 'infinite') {
    this.state.repeatMode = mode;
    this.state.currentRepeatCount = 0;
    this.notify();
  }

  public setAutoPlayNext(enabled: boolean) {
    this.state.autoPlayNext = enabled;
    this.notify();
  }

  public playAyah(ayah: Ayah, ayahsContext?: Ayah[]) {
    if (ayahsContext && ayahsContext.length > 0) {
      this.currentAyahList = ayahsContext;
    }

    const index = this.currentAyahList.findIndex(a => a.number === ayah.number);
    if (index >= 0) {
      this.currentAyahIndex = index;
    } else {
      this.currentAyahList = [ayah];
      this.currentAyahIndex = 0;
    }

    this.state.currentRepeatCount = 0;
    this.loadAyahByIndex(this.currentAyahIndex, true);
  }

  public togglePlayPause() {
    if (!this.audio) return;
    if (this.state.isPlaying) {
      this.audio.pause();
    } else {
      if (this.state.currentAyahNumber === null && this.currentAyahList.length > 0) {
        this.loadAyahByIndex(0, true);
      } else {
        this.audio.play().catch(e => console.warn('Audio play request interrupted:', e));
      }
    }
  }

  public pause() {
    if (this.audio && this.state.isPlaying) {
      this.audio.pause();
    }
  }

  public nextAyah() {
    if (this.currentAyahIndex < this.currentAyahList.length - 1) {
      this.currentAyahIndex += 1;
      this.state.currentRepeatCount = 0;
      this.loadAyahByIndex(this.currentAyahIndex, true);
    }
  }

  public previousAyah() {
    if (this.currentAyahIndex > 0) {
      this.currentAyahIndex -= 1;
      this.state.currentRepeatCount = 0;
      this.loadAyahByIndex(this.currentAyahIndex, true);
    }
  }

  public seek(targetRatio: number) {
    if (!this.audio || !this.audio.duration) return;
    const clamped = Math.max(0, Math.min(1, targetRatio));
    this.audio.currentTime = clamped * this.audio.duration;
  }

  private loadAyahByIndex(index: number, autoStart: boolean) {
    if (!this.audio || index < 0 || index >= this.currentAyahList.length) return;

    const ayah = this.currentAyahList[index];
    const reciter = RECITERS_LIST.find(r => r.id === this.state.reciterId) || RECITERS_LIST[0];

    const audioUrl = getAyahAudioUrl(ayah.surahNumber, ayah.numberInSurah, reciter.subfolder);

    this.state.currentAyahNumber = ayah.number;
    this.state.currentAyahInSurah = ayah.numberInSurah;
    this.state.currentSurahNumber = ayah.surahNumber;
    this.state.isLoading = true;
    this.state.progress = 0;
    this.state.currentTime = 0;
    this.notify();

    this.audio.src = audioUrl;
    this.audio.playbackRate = this.state.playbackSpeed;

    if (autoStart) {
      this.audio.play().catch(err => {
        console.warn('Playback prevented or interrupted:', err);
        this.state.isPlaying = false;
        this.state.isLoading = false;
        this.notify();
      });
    }
  }

  private handleAyahEnded() {
    const maxRepeats = this.getMaxRepeatLimit(this.state.repeatMode);

    if (this.state.repeatMode === 'infinite') {
      // Loop same ayah forever (for Hifz / Tajweed drill)
      this.state.currentRepeatCount += 1;
      if (this.audio) {
        this.audio.currentTime = 0;
        this.audio.play().catch(() => {});
      }
      this.notify();
      return;
    }

    if (this.state.currentRepeatCount + 1 < maxRepeats) {
      this.state.currentRepeatCount += 1;
      if (this.audio) {
        this.audio.currentTime = 0;
        this.audio.play().catch(() => {});
      }
      this.notify();
      return;
    }

    // Reset repeat counter for next verse
    this.state.currentRepeatCount = 0;

    // Proceed to next Ayah if autoPlayNext is enabled
    if (this.state.autoPlayNext && this.currentAyahIndex < this.currentAyahList.length - 1) {
      this.currentAyahIndex += 1;
      this.loadAyahByIndex(this.currentAyahIndex, true);
    } else {
      this.state.isPlaying = false;
      this.notify();
    }
  }

  private getMaxRepeatLimit(mode: AudioPlaybackState['repeatMode']): number {
    switch (mode) {
      case 'once': return 1;
      case 'twice': return 2;
      case 'thrice': return 3;
      case 'five': return 5;
      case 'infinite': return Infinity;
      default: return 1;
    }
  }
}

export const audioManager = new QuranAudioManager();
