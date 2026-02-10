import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [finalTranscript, setFinalTranscript] = useState('');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => {
    if (!SpeechRecognition) {
      setIsSupported(false);
      console.error('Speech Recognition is not supported in this browser');
      return;
    }
  }, [SpeechRecognition]);

  const startListening = useCallback(() => {
    if (!isSupported || !SpeechRecognition) return;

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscriptPart = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptPart += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(interimTranscript);
      setFinalTranscript(prev => prev + finalTranscriptPart);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        // Restart listening if it was interrupted unexpectedly
        setTimeout(() => {
          if (isListening) {
            startListening();
          }
        }, 100);
      } else {
        // Only set to false if we intentionally stopped
        setIsListening(false);
      }
    };

    recognition.start();
    setIsListening(true);

    // Store recognition instance to allow stopping later
    (window as any).__speechRecognitionInstance = recognition;

    return () => {
      recognition.stop();
    };
  }, [isSupported, SpeechRecognition]);

  const stopListening = useCallback(() => {
    if ((window as any).__speechRecognitionInstance) {
      (window as any).__speechRecognitionInstance.stop();
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setFinalTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    finalTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};