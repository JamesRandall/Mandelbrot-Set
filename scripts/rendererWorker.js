self.onmessage = function(e) {
	var maxIteration = 100;
	var imageData = e.data.imageData;
	var xMin = e.data.xMin;
	var xMax = e.data.xMax;
	var yMin = e.data.yMin;
	var yMax = e.data.yMax;
	
	var sx;
	var sy;
	var scaledX;
	var scaledY;
	var x;
	var y;
	var iteration;
	var xTemp;
	var color;
	var imageData;
	
	var xScale = (xMax - xMin) / imageData.width;
	var yScale = (yMax - yMin) / imageData.height;
	
	Number.prototype['integer'] = function() {
		return Math[this < 0 ? 'ceil' : 'floor'](this);
	};
	
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
	
	function setPixel(x, y, red, green, blue) {
		var offset = (y * imageData.width * 4) + x * 4;
		imageData.data[offset] = red;
		imageData.data[offset+ 1] = green;
		imageData.data[offset + 2] = blue;
		imageData.data[offset + 3] = 255;
	}
	
	for (sx = 0; sx < imageData.width; sx++) {
		for (sy = 0; sy < imageData.height; sy++) {
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
				setPixel(sx, sy, 0, 0, 0);
			}
			else {
				color = getColor(iteration);
				setPixel(sx, sy, color.red, color.green, color.blue);
			}
		}
	}
	
	self.postMessage(imageData);
};