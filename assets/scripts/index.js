(function() {
	var visual = "wave";

  var canvas = document.getElementById('wave-canvas');
  var mode = document.getElementsByName('mode');

  var ctx = canvas.getContext('2d');
  canvas.width = document.body.clientWidth;

  const CANVAS_HEIGHT = canvas.height;
  const CANVAS_WIDTH = canvas.width;

  var context = new AudioContext();
  var analyser = context.createAnalyser();

  function onLoad(e) {
    var source;

    navigator.webkitGetUserMedia({
        audio: true
      }, function(stream) {
        source = context.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.connect(context.destination);
        visualize();
      }, function(err) {
      }
    );
  }

  function changeMode(event) {
  	visual = event.target.value || 'wave';
  }

  function visualize() {
  	drawVisual = requestAnimationFrame(visualize, canvas);
  	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  	ctx.fillStyle = '#c62b26';
  	ctx.strokeStyle = '#c62b26';

    if (visual === 'wave') {
      analyser.fftSize = 2048;
      var bufferLength = analyser.fftSize;
      var dataArray = new Uint8Array(bufferLength);

      analyser.getByteTimeDomainData(dataArray);

      ctx.lineWidth = 1;
      ctx.beginPath();

      var sliceWidth = CANVAS_WIDTH / bufferLength;
      var y;

      for (var i = 0; i < bufferLength; i++) {
        y = dataArray[i] / 128 * CANVAS_HEIGHT / 2;
        if (i === 0) {
          ctx.moveTo(0, y);
        } else {
          ctx.lineTo(sliceWidth * i, y);
        }
      }

      ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
      ctx.stroke();

    } else {
      analyser.fftSize = 512;

      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);

      analyser.getByteFrequencyData(dataArray);
    
      var oneWidth = CANVAS_WIDTH / bufferLength;
      var barWidth = oneWidth / 1.5;
      var barHeight;
      var spaceWidth = oneWidth - barWidth;

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        ctx.fillRect(i * oneWidth + spaceWidth, CANVAS_HEIGHT, barWidth, -barHeight / 2 - 1);
      }

    }
  }

  window.addEventListener('load', onLoad);
  document.addEventListener('change', changeMode);
})();
