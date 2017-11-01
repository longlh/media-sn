$(document).ready(function() {
	var MEDIA_SELECTED_CLASS = 'media-item-selected';
	var mediaSelected = [];
	var $inputTags = $('#input-tags');

	$inputTags.selectize({
		delimiter: ',',
		persist: false,
		create: function(input) {
			return {
				value: input,
				text: input
			};
		}
	});

	$('#media-list .media-item').click(function() {
		var $this = $(this);
		var alias = $this.data('alias');
		var index = mediaSelected.indexOf(alias);

		if ($this.hasClass(MEDIA_SELECTED_CLASS)) {
			$this.removeClass(MEDIA_SELECTED_CLASS);

			if (index > -1) {
				mediaSelected.splice(index, 1);
			}
		} else {
			$this.addClass(MEDIA_SELECTED_CLASS);

			if (index < 0) {
				mediaSelected.push(alias);
			}
		}
	});

	$('#btn-add-tags').click(function() {
		if (!mediaSelected.length) {
			return alert('Please select media');
		}

		var tags = $inputTags.val().map(function(tag) {
			var nameSlug = slug(tag);
			var isExisting = window.GLOBAL.tags.some(function(tag) {
				return tag.slug === nameSlug;
			});

			return {
				name: tag,
				slug: nameSlug,
				isNew: !isExisting
			};
		});

		$.ajax({
			type: 'POST',
			url: '/api/media/tags',
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify({
				tags: tags,
				aliases: mediaSelected,
			}),
			success: function() {
				window.location.reload();
			}
		});
	});
});
