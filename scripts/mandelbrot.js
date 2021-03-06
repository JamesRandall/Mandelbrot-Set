define(["jquery", "metrics"], function($, metrics) {
	var xMin;
	var xMax;
	var yMin;
	var yMax;
	var disabled = false;
	var worker;
	if (Modernizr.webworkers) {
		worker = new Worker("scripts/rendererWorker.js");
	}
	
	function getCanvas() { return $("#mandelbrotCanvas")[0]; }
	
	function getContext() { return getCanvas().getContext("2d"); }
	
	function render() {
		var context;
		var imageData;
		var iterations;
		
		$('#resetButton').attr('disabled', 'true');
		$('#timeTaken').html('Rendering in progress');
		disabled = true;
		
		context = getContext();			
		imageData = context.createImageData(metrics.width, metrics.height);
		iterations = parseInt($('#iterations').val(), 10);
		if (isNaN(iterations)) {
			iterations = 100;
		}

		worker.onmessage = function(e) {
			context.putImageData(e.data.imageData, 0, 0);
			$('#timeTaken').html(e.data.timeTaken + 'ms');
			$('#resetButton').removeAttr('disabled');
			disabled = false;		
		};
		
		worker.postMessage({
			imageData: imageData,
			xMin: xMin,
			xMax: xMax,
			yMin: yMin,
			yMax: yMax,
			width: metrics.width,
			height: metrics.height,
			numberOfIterations: iterations
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
			var mousedragImageData = null;
			
			$('#resetButton').click(function() {
				reset();
			});
			
			mandelbrotCanvas = $('#mandelbrotCanvas');
			
			mandelbrotCanvas.mousedown(function(e) {
				if (disabled) {
					return;
				}
				
				var canvasPos = mandelbrotCanvas.position();
				mousedownX = (e.pageX - canvasPos.left) * metrics.scale;
				mousedownY = (e.pageY - canvasPos.top) * metrics.scale;
				mousedragImageData = getContext().getImageData(0,0,mandelbrotCanvas[0].width,mandelbrotCanvas[0].height);
			});
			
			mandelbrotCanvas.mousemove(function(e) {
				var canvasPos;
				var currentX;
				var currentY;
				var context;
				
				if (mousedragImageData !== null && !disabled) {
					canvasPos = mandelbrotCanvas.position();
					currentX = (e.pageX - canvasPos.left) * metrics.scale;
					currentY = (e.pageY - canvasPos.top) * metrics.scale;
					context = getContext();
				
					context.putImageData(mousedragImageData, 0, 0);
					context.fillStyle = "rgba(64,64,64,0.6)";
					context.strokeStyle = "rgba(255,255,255,1.0)";
					context.fillRect(mousedownX, mousedownY, currentX - mousedownX, currentY - mousedownY);
					context.strokeRect(mousedownX, mousedownY, currentX - mousedownX, currentY - mousedownY);
				}
			});
			
			mandelbrotCanvas.mouseup(function(e) {
				if (disabled) {
					return;
				}
				
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
				
				mouseupX = (e.pageX - canvasPos.left) * metrics.scale;
				mouseupY = (e.pageY - canvasPos.top) * metrics.scale;
				
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
				bottom = top + height;
				
				xMax = xMin + right * xScale;
				xMin = xMin + left * xScale;
				yMax = yMin + bottom * yScale;
				yMin = yMin + top * yScale;
				
				mousedragImageData = null;
				
				render();
			});
			
			reset();
		}
	};
});