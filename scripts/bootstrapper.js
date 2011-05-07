require(["jquery",
        "metrics",
		"jsExtensions",
		"mandelbrot"], function($, metrics, jsExtensions, mandelbrot) {
	if (Modernizr.canvastext && Modernizr.webworkers)
	{
		jsExtensions();
	
	    $(document).ready(function() {
		    metrics.width = $("#mandelbrot").width();
			metrics.height = $("#mandelbrot").height();
			$("#mandelbrot").append(
				$('<canvas id="mandelbrotCanvas" width="' + metrics.width + '" height="' + metrics.height + '">')
			);
			mandelbrot.begin();
	    });
	}
	else
	{
		$("#browserNotSupported").show();
		$("#astar").hide();
	}
});
