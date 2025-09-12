// Pre-create the AudioContext outside of the function to avoid delay.
let audioContext = new (window.AudioContext || window.webkitAudioContext)();

const playBeep = () => {
	const oscillator = audioContext.createOscillator();
	const gain = audioContext.createGain();

	oscillator.type = 'sine';
	oscillator.frequency.value = 750;

	gain.gain.setValueAtTime(0.2, audioContext.currentTime);
	gain.gain.setValueAtTime(0, audioContext.currentTime + 0.1);

	oscillator.connect(gain);
	gain.connect(audioContext.destination);

	oscillator.start(audioContext.currentTime);
	oscillator.stop(audioContext.currentTime + 0.2);
};

export default playBeep;
