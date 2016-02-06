$(function() {

	//show comment form only when user click   comment button
	$("#post-comment").hide();
	$("#btn-comment").on("click", function(event) {
		event.preventDefault();
		$("#post-comment").show();
	});



	$('#btn-like').on('click', function(event) {
		event.preventDefault();
		//console.log($(this).data('id'));
		var imgId = $(this).data("id");

		$.post('/images/' + imgId + '/like').done(function(data) {
			$('.likes-count').text(data.likes);
		});
	});
});