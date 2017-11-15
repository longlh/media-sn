$(document).ready(function() {
	$('.list-group-item-delete').click(function() {
		var id = $(this).data('id');

		$.ajax({
			type: 'DELETE',
			url: '/api/tags/' + id,
			success: function() {
				$('#item-' + id).remove();
			}
		});
	});
});
