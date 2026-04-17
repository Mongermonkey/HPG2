export {};

declare global
{
  interface Window
  {
    talkify?: any;
    dialogueAudioEnabled?: boolean;
    talkifyApiKey?: string;
  }
}
