;(function() {
  function getSelection() {
    var ids = [];

    $('.checkbox:checked').each(function(index, input) {
      ids.push(input.getAttribute('data-ref'));
    });

    return ids;
  }

  $(document).ready(function() {
    $('.checkbox').on('change', function() {
      $('#selection-count').text($('.checkbox:checked').length);
    });

    $('#restore').click(function() {
      var ids = getSelection();

      $.ajax({
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        url: '/api/media/restore',
        data: JSON.stringify({
          ids: ids
        }),
        complete: function() {
          location.reload()
        }
      });
    });

    $('#delete').click(function() {
      var ids = getSelection();

      $.ajax({
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        url: '/api/media/remove',
        data: JSON.stringify({
          ids: ids
        }),
        complete: function() {
          location.reload()
        }
      });
    });
  });
})();
