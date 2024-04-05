export const Analyse = function (audio) {
  var an = this,
    AudioContext = window.AudioContext || window.webkitAudioContext;
  this.audio = audio;
  this.context = new AudioContext();
  this.node = this.context.createScriptProcessor(2048, 1, 1);
  this.analyser = this.context.createAnalyser();
  this.analyser.smoothingTimeConstant = 0;
  this.analyser.fftSize = 512;
  let bufferLength = this.analyser.frequencyBinCount;
  this.bands = new Uint8Array(bufferLength);
  an.source = an.context.createMediaElementSource(an.audio);
  an.source.connect(an.analyser);
  an.analyser.connect(an.node);
  an.node.connect(an.context.destination);
  an.source.connect(an.context.destination);
  an.node.onaudioprocess = function () {
    an.analyser.getByteFrequencyData(an.bands);
    if (!an.audio.paused) {
      if (typeof an.update === "function") {
        return an.update(an.bands);
      } else {
        return 0;
      }
    }
  };
  return this;
};
