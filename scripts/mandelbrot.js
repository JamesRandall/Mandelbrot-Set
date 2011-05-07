define(["renderer" ], function(renderer) {	
	function reset(board, boardType) {
		board.reset(boardType);
		renderer.render(board);
	}
	
	return {
		begin: function() {
			$('#resetButton').click(function() {
				renderer.render();
			})
		}
	};
});