let player: any | null = null;
let preferredEnglishVoice: SpeechSynthesisVoice | null = null;
let voicesInitialized = false;
let voiceReadyPromise: Promise<void> | null = null;
let audioTrackReady = false;
let userGestureUnlocked = false;

const DIALOGUE_VOICE_URI_STORAGE_KEY = 'hpg2-dialogue-voice-uri';
const MALE_VOICE_HINTS = [
  'david', 'guy', 'george', 'james', 'john', 'mark', 'daniel', 'arthur', 'thomas', 'male', 'man', 'old'
];
const FEMALE_VOICE_HINTS = [
  'aria', 'jenny', 'emma', 'sara', 'sonia', 'hazel', 'zira', 'susan', 'female', 'woman', 'girl'
];

const hasRemoteTalkifyKey = (): boolean => {
  const talkify = (window as any).talkify;
  const globalKey = String((window as any).talkifyApiKey ?? '').trim();
  if (!talkify?.config?.remoteService) return globalKey.length > 0;

  if (globalKey.length > 0)
  {
    talkify.config.remoteService.apiKey = globalKey;
  }

  return String(talkify.config.remoteService.apiKey ?? '').trim().length > 0;
};

const normalizeDialogueText = (text: string): string => {
  return text
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const loadStoredVoiceUri = (): string | null => {
  try
  {
    const saved = localStorage.getItem(DIALOGUE_VOICE_URI_STORAGE_KEY);
    return saved && saved.trim().length > 0 ? saved : null;
  }
  catch
  {
    return null;
  }
};

const saveStoredVoiceUri = (voiceUri: string): void => {
  try
  {
    localStorage.setItem(DIALOGUE_VOICE_URI_STORAGE_KEY, voiceUri);
  }
  catch
  {
    // Ignore storage failures and keep runtime voice selection active.
  }
};

const getVoiceScore = (voice: SpeechSynthesisVoice): number => {
  const voiceName = voice.name.toLowerCase();
  const voiceLang = voice.lang.toLowerCase();

  let score = 0;

  if (voiceLang.startsWith('en-us')) score += 120;
  else if (voiceLang.startsWith('en-gb')) score += 110;
  else if (voiceLang.startsWith('en')) score += 90;

  if (voice.localService) score += 20;
  if (voice.default) score += 10;

  // Prefer common high-quality English voices from major engines.
  if (voiceName.includes('microsoft')) score += 40;
  if (voiceName.includes('google')) score += 35;
  if (voiceName.includes('natural')) score += 28;
  if (voiceName.includes('neural')) score += 28;

  // Strongly prefer male-sounding English voices.
  for (const hint of MALE_VOICE_HINTS)
  {
    if (voiceName.includes(hint)) score += 18;
  }

  for (const hint of FEMALE_VOICE_HINTS)
  {
    if (voiceName.includes(hint)) score -= 24;
  }

  // Slight preference for UK timbre, often perceived as more mature/formal.
  if (voiceLang.startsWith('en-gb')) score += 8;

  return score;
};

const isFemaleHintedVoice = (voice: SpeechSynthesisVoice): boolean => {
  const voiceName = voice.name.toLowerCase();
  return FEMALE_VOICE_HINTS.some((hint) => voiceName.includes(hint));
};

const isAllowedNarratorVoice = (voice: SpeechSynthesisVoice): boolean => {
  const voiceLang = voice.lang.toLowerCase();
  if (!voiceLang.startsWith('en')) return false;
  if (isFemaleHintedVoice(voice)) return false;
  return true;
};

const pickPreferredEnglishVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const storedVoiceUri = loadStoredVoiceUri();
  if (storedVoiceUri)
  {
    const storedVoice = voices.find((voice) => voice.voiceURI === storedVoiceUri);
    if (storedVoice && isAllowedNarratorVoice(storedVoice))
    {
      return storedVoice;
    }
  }

  const pool = voices.filter((voice) => isAllowedNarratorVoice(voice));
  if (pool.length === 0) return null;

  const sorted = [...pool].sort((a, b) => getVoiceScore(b) - getVoiceScore(a));
  const selected = sorted[0] ?? null;
  if (selected) saveStoredVoiceUri(selected.voiceURI);
  return selected;
};

const waitForSpeechVoices = (): Promise<void> => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window))
  {
    return new Promise(() => {
      // Hard gate: do not start the game without speech synthesis support.
    });
  }

  const synth = window.speechSynthesis;

  return new Promise((resolve) => {
    let settled = false;

    const completeIfReady = () => {
      if (settled) return;
      const voices = synth.getVoices();
      if (!voices || voices.length === 0) return;
      const desiredVoice = pickPreferredEnglishVoice();
      if (!desiredVoice) return;
      preferredEnglishVoice = desiredVoice;
      settled = true;
      clearInterval(pollId);
      synth.removeEventListener('voiceschanged', completeIfReady);
      resolve();
    };

    const pollId = window.setInterval(completeIfReady, 200);
    synth.addEventListener('voiceschanged', completeIfReady);
    completeIfReady();
  });
};

const waitForUserInteraction = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();

  const userActivation = (navigator as any).userActivation;
  if (userGestureUnlocked || (userActivation && userActivation.isActive)) return Promise.resolve();

  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      userGestureUnlocked = true;
      window.removeEventListener('pointerdown', finish);
      window.removeEventListener('keydown', finish);
      window.removeEventListener('touchstart', finish);
      resolve();
    };

    window.addEventListener('pointerdown', finish, { once: true });
    window.addEventListener('keydown', finish, { once: true });
    window.addEventListener('touchstart', finish, { once: true });
  });
};

export function unlockDialogueAudioFromGesture(): void
{
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined')
  {
    return;
  }

  userGestureUnlocked = true;

  try
  {
    const synth = window.speechSynthesis;
    const unlockUtterance = new SpeechSynthesisUtterance('unlock');
    unlockUtterance.volume = 0;
    unlockUtterance.rate = 1;
    unlockUtterance.pitch = 1;
    synth.cancel();
    synth.speak(unlockUtterance);
    synth.cancel();
  }
  catch
  {
    // Keep trying via normal warm-up flow.
  }
}

const warmupSpeechTrack = (voice: SpeechSynthesisVoice): Promise<boolean> => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined')
  {
    return new Promise(() => {
      // Hard gate: no speech synthesis support means no track readiness.
    });
  }

  const synth = window.speechSynthesis;

  return new Promise((resolve) => {
    const probe = new SpeechSynthesisUtterance('ready');
    probe.voice = voice;
    probe.lang = voice.lang;
    probe.rate = 1;
    probe.pitch = 1;
    probe.volume = 0.01;

    let settled = false;
    const done = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      resolve(ok);
    };

    const timeoutId = window.setTimeout(() => {
      done(false);
    }, 1600);

    probe.onstart = () => done(true);
    probe.onend = () => done(true);
    probe.onerror = () => {
      done(false);
    };

    try
    {
      synth.cancel();
      synth.speak(probe);
    }
    catch
    {
      done(false);
    }
  });
};

export async function ensureDialogueVoiceReady(): Promise<void>
{
  if (voiceReadyPromise) return voiceReadyPromise;

  voiceReadyPromise = (async () => {
    while (true)
    {
      await waitForSpeechVoices();

      const selected = pickPreferredEnglishVoice();
      if (!selected)
      {
        await waitForUserInteraction();
        continue;
      }

      const warmupOk = await warmupSpeechTrack(selected);
      if (!warmupOk)
      {
        await waitForUserInteraction();
        continue;
      }

      voicesInitialized = true;
      preferredEnglishVoice = selected;
      audioTrackReady = true;

      if (typeof window !== 'undefined' && 'speechSynthesis' in window)
      {
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          preferredEnglishVoice = pickPreferredEnglishVoice();
        });
      }

      return;
    }
  })();

  return voiceReadyPromise;
}

const ensureSpeechVoiceSetup = (): void => {
  if (voicesInitialized || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const selectedVoice = pickPreferredEnglishVoice();
  if (!selectedVoice) return;

  voicesInitialized = true;
  preferredEnglishVoice = selectedVoice;

  window.speechSynthesis.addEventListener('voiceschanged', () => {
    preferredEnglishVoice = pickPreferredEnglishVoice();
  });
};

const speakWithWebSpeech = (text: string): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined')
  {
    return false;
  }

  if (!audioTrackReady) return false;

  ensureSpeechVoiceSetup();

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  const englishVoice = preferredEnglishVoice ?? pickPreferredEnglishVoice();
  if (!englishVoice) return false;

  // Lower pitch/rate for a deeper, more mature narration style.
  utterance.rate = 1.15;
  utterance.pitch = 0.50;
  utterance.volume = 1;
  utterance.lang = englishVoice?.lang ?? 'en-US';
  if (englishVoice) utterance.voice = englishVoice;

  try
  {
    synth.cancel();
    synth.speak(utterance);
    return true;
  }
  catch
  {
    return false;
  }
};

const getTalkifyPlayer = (): any | null => {
  const talkify = (window as any).talkify;
  if (!talkify) return null;

  if (!player)
  {
    const canUseRemoteTts = typeof talkify.TtsPlayer === 'function' && hasRemoteTalkifyKey();
    if (canUseRemoteTts)
    {
      player = new talkify.TtsPlayer();
    }
    else if (typeof talkify.Html5Player === 'function')
    {
      player = new talkify.Html5Player();
    }
    else
    {
      return null;
    }
  }

  return player;
};

export function stopDialogueAudio(): void
{
  if (typeof window !== 'undefined' && 'speechSynthesis' in window)
  {
    try
    {
      window.speechSynthesis.cancel();
    }
    catch
    {
      // Ignore speech synthesis cancellation errors.
    }
  }

  if (!player) return;

  try
  {
    if (typeof player.pause === 'function') player.pause();
    if (typeof player.stop === 'function') player.stop();
    if (typeof player.cancel === 'function') player.cancel();
  }
  catch
  {
    // Keep gameplay flow running even if TTS APIs vary across Talkify builds.
  }
}

export function speakDialogueText(text: string): void
{
  if (!text) return;
  if (!(window as any).dialogueAudioEnabled) return;

  ensureSpeechVoiceSetup();

  const normalizedText = normalizeDialogueText(text);
  if (!normalizedText) return;

  stopDialogueAudio();

  if (speakWithWebSpeech(normalizedText)) return;

  const talkifyPlayer = getTalkifyPlayer();
  if (!talkifyPlayer || typeof talkifyPlayer.playText !== 'function') return;

  try
  {
    talkifyPlayer.playText(normalizedText);
  }
  catch
  {
    // Ignore TTS runtime failures and keep text narration available.
  }
}
