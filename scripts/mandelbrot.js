define(["jquery", "metrics"], function($, metrics) {
	var xMin;
	var xMax;
	var yMin;
	var yMax;
	
	function getCanvas() { return $("#mandelbrotCanvas")[0]; }
	
	function getContext() { return getCanvas().getContext("2d"); }
	
	function render() {
		var context;
		var imageData;
		var worker;
		
		$('#resetButton').attr('disabled', 'true');
		
		context = getContext();			
		imageData = context.createImageData(metrics.width, metrics.height);

		worker = new Worker("scripts/rendererWorker.js");
		worker.onmessage = function(e) {
			context.putImageData(e.data.imageData, 0, 0);
			$('#timeTaken').html(e.data.timeTaken + 'ms');
			$('#resetButton').removeAttr('disabled');			
		}

		worker.postMessage({
			imageData: imageData,
			xMin: xMin,
			xMax: xMax,
			yMin: yMin,
			yMax: yMax
		});
	}
	
	function reset() {
		xMin = -2.1;
		xMax = 0.9;
		yMin = -1;
		yMax = 1;
		
		render();
	}
	
	return {
		begin: function() {
			var mousedownX;
			var mousedownY;
			var mouseupX;
			var mouseupY;
			var mandelbrotCanvas;
			
			reset();
			
			$('#resetButton').click(function() {
				reset();
			})
			mandelbrotCanvas = $('#mandelbrotCanvas');
			mandelbrotCanvas.mousedown(function(e) {
				var canvasPos = mandelbrotCanvas.position();
				mousedownX = e.pageX - canvasPos.left;
				mousedownY = e.pageY - canvasPos.top;
			});
			mandelbrotCanvas.mouseup(function(e) {
				var canvasPos = mandelbrotCanvas.position();
				var xScale = (xMax - xMin) / mandelbrotCanvas[0].width;
				var yScale = (yMax - yMin) / mandelbrotCanvas[0].height;
				var left;
				var top;
				var right;
				var bottom;
				var width;
				var height;
				var centerX;
				var centerY;
				var aspectRatio = mandelbrotCanvas[0].width / mandelbrotCanvas[0].height;
				
				mouseupX = e.pageX - canvasPos.left;
				mouseupY = e.pageY - canvasPos.top;
				
				left = Math.min(mousedownX, mouseupX);
				right = Math.max(mousedownX, mouseupX);
				top = Math.min(mousedownY, mouseupY);
				bottom = Math.max(mousedownY, mouseupY);
				
				width = right - left;
				height = bottom - top;
				
				centerX = left + width/2;
				centerY = top + height/2;
				
				if (width > height) {
					height = width/aspectRatio;
				} else {
					width = height * aspectRatio;
				}
				
				left = centerX - width/2;
				right = left + width;
				top = centerY - height/2;
				bottom = centerY + height;
				
				xMax = xMin + right * xScale;
				xMin = xMin + left * xScale;
				yMax = yMin + bottom * yScale;
				yMin = yMin + top * yScale;
				
				render();
			});
			
			render();
		}
	};
});