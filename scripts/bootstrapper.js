require(["jquery",
        "metrics",
		"jsExtensions",
		"mandelbrot"], function($, metrics, jsExtensions, mandelbrot) {
	jsExtensions();

    $(document).ready(function() {
		if (Modernizr.canvastext && Modernizr.webworkers)
		{
	    	metrics.width = $("#mandelbrot").width();
			metrics.height = $("#mandelbrot").height();
			metrics.scale = 1;
			var canvas = $('<canvas id="mandelbrotCanvas" style="width:' + metrics.width + 'px; height: ' + metrics.height + 'px;">');
			if (window.devicePixelRatio > 1.5) {
				metrics.scale = 2;
			}
			metrics.width *= metrics.scale;
			metrics.height *= metrics.scale;
			canvas.attr({width: metrics.width, height: metrics.height});
			$("#mandelbrot").append(canvas);
			mandelbrot.begin();
		}
		else
		{
			$("#browserNotSupported").show();
			$("#mandelbrot").hide();
		}
    });
});
