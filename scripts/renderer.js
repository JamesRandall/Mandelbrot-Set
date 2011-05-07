define(["jquery", "metrics"], function($, metrics) {
	var maxIteration = 100;
	
	function getCanvas() { return $("#mandelbrotCanvas")[0]; }
	
	function getContext() { return getCanvas().getContext("2d"); }
	
	function getColor(iteration) {
		var ratio = iteration / maxIteration;
		var red = 0;
		var green = 0;
		var blue = 0;
		
		if ((ratio >= 0) && (ratio < 0.125))
		{
			red = red = (ratio  / 0.125) * (512) + 0.5;
			green = 0;
			blue = 0;
		}

		if ((ratio >= 0.125) && (ratio < 0.250))
		{
			red = 255;
			green = (((ratio - 0.125) / 0.125) * (512) + 0.5);
			blue = 0;
		}

		if ((ratio >= 0.250) && (ratio < 0.375))
		{
			red = ((1.0 - ((ratio - 0.250) / 0.125)) * (512) + 0.5);
			green = 255;
			blue = 0;
		}

		if ((ratio >= 0.375) && (ratio < 0.500))
		{
			red = 0;
			green = 255;
			blue = (((ratio - 0.375) / 0.125) * (512) + 0.5);
		}

		if ((ratio >= 0.500) && (ratio < 0.625))
		{
			red = 0;
			green = ((1.0 - ((ratio - 0.500) / 0.125)) * (512) + 0.5);
			blue = 255;
		}

		if ((ratio >= 0.625) && (ratio < 0.750))
		{
			red = (((ratio - 0.625) / 0.125) * (512) + 0.5);
			green = 0;
			blue = 255;
		}

		if ((ratio >= 0.750) && (ratio < 0.875))
		{
			red = 255;
			green = (((ratio - 0.750) / 0.125) * (512) + 0.5);
			blue = 255;
		}

		if ((ratio >= 0.875) && (ratio <= 1.000))
		{
			red = ((1.0 - ((ratio - 0.875) / 0.125)) * (512) + 0.5);
			green = ((1.0 - ((ratio - 0.875) / 0.125)) * (512) + 0.5);
			blue = ((1.0 - ((ratio - 0.875) / 0.125)) * (512) + 0.5);
		}
		
		return {
			red: red.integer(),
			green: green.integer(),
			blue: blue.integer()
		};
	}
		
	return {
		render: function() {
			var context;
			var sx;
			var sy;
			var scaledX;
			var scaledY;
			var xMin = -2.5;
			var xMax = 1.0;
			var yMin = -1;
			var yMax = 1;
			var x;
			var y;
			var iteration;
			var xTemp;
			var color;
			var fillStyle;
			
			var xScale = (xMax - xMin) / metrics.width;
			var yScale = (yMax - yMin) / metrics.height;
			
			context = getContext();			
			/*context.clearRect(0, 0, metrics.width, metrics.height);
			context.fillStyle = "rgba(38,104,209,1.0)";
			context.fillRect(0, 0, metrics.width, metrics.height);*/
			
			for (sx = 0; sx < metrics.width; sx++) {
				for (sy = 0; sy < metrics.height; sy++) {
					scaledX = sx * xScale + xMin;
					scaledY = sy * yScale + yMin;
					
					iteration = 0;
					x = 0;
					y = 0;
					while ((x*x + y*y) <= (2*2) && iteration < maxIteration) {
						xTemp = x*x - y*y + scaledX;
						y = 2*x*y + scaledY;
						x = xTemp;
						
						iteration = iteration + 1;
					}
					
					if (iteration === maxIteration) {
						context.fillStyle = "rgba(0,0,0,1)";
					}
					else {
						color = getColor(iteration);
						fillStyle = 'rgba(' + color.red + ',' + color.green + ',' + color.blue +', 1)';
						context.fillStyle = fillStyle;
					}
					
					context.fillRect(sx, sy, 1, 1);
				}
			}
		}
	};	
});