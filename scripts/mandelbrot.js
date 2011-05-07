define(["jquery", "metrics"], function($, metrics) {
	var xMin = -2.5;
	var xMax = 1.0;
	var yMin = -1;
	var yMax = 1;
	
	function getCanvas() { return $("#mandelbrotCanvas")[0]; }
	
	function getContext() { return getCanvas().getContext("2d"); }
	
	function render() {
		var context;
		var imageData;
		var worker;

		context = getContext();			
		imageData = context.createImageData(metrics.width, metrics.height);

		worker = new Worker("scripts/rendererWorker.js");
		worker.onmessage = function(e) {
			context.putImageData(e.data, 0, 0);
		}

		worker.postMessage({
			imageData: imageData,
			xMin: -2.5,
			xMax: 1.0,
			yMin: -1,
			yMax: 1
		});
	}
	
	return {
		begin: function() {
			$('#resetButton').click(function() {
				render();
			})
		}
	};
});