// Helper function to create background noise
const createBackgroundNoise = () => {
  // Create a silent audio context and generate white noise
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const bufferSize = audioContext.sampleRate * 3; // 3 seconds of noise
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  // Fill with white noise (random values)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1; // Random value between -1 and 1
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  // Connect to output
  source.connect(audioContext.destination);
  source.start();

  return { source, audioContext };
};

export { createBackgroundNoise };