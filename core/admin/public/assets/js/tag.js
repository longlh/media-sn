;(function() {
  $(document).ready(function() {
    $('#show-deleted').change(function() {
      var checked = $(this).is(':checked');

      if (checked) {
        location.href = '/admin/tags?deleted=true';
      } else {
        location.href = '/admin/tags';
      }
    });

    $('#name').change(function() {
      var value = this.value;

      var s = slug(value, {
        lower: true,
        symbols: false
      });

      $('#slug').val(s);
    });
  });
})();
