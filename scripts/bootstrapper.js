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
			$("#mandelbrot").append(
				$('<canvas id="mandelbrotCanvas" width="' + metrics.width + '" height="' + metrics.height + '">')
			);
			mandelbrot.begin();
		}
		else
		{
			$("#browserNotSupported").show();
			$("#mandelbrot").hide();
		}
    });
});
