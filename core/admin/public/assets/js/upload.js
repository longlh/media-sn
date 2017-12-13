console.log('Upload JS loaded');

$(document).ready(function() {
	var uploader = new plupload.Uploader({
		browse_button: 'browse-button',
		url: '/api/upload',
		multi_selection: true,
		chunk_size: '512kb',
		unique_names: true
	});

	uploader.bind('FilesAdded', function(uploader, files) {
		if (!files || !files.forEach) {
			return;
		}

		files.forEach(function(file) {
			$('#queue').append($('<li></li>').text(file.name));
		});
	});

	uploader.bind('UploadComplete', function() {
		alert('Upload finish');

		$('#queue').empty();
	});

	uploader.init();

	$('#upload-button').click(function() {
		uploader.start();
	});
});
