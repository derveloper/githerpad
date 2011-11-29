new function($) {
  $.fn.setCursorPosition = function(pos) {
    if ($(this).get(0).setSelectionRange) {
      $(this).get(0).setSelectionRange(pos, pos);
    } else if ($(this).get(0).createTextRange) {
      var range = $(this).get(0).createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }
}(jQuery);

new function($) {
  $.fn.getCursorPosition = function() {
    if ($(this).get(0).selectionStart) {
      return $(this).get(0).selectionStart;
    } else if (document.selection) {
      $(this).get(0).focus();
      var r = document.selection.createRange();
      if (r == null) {
        return 0;
      }

      var re = $(this).get(0).createTextRange(),
          rc = re.duplicate();
      re.moveToBookmark(r.getBookmark());
      rc.setEndPoint('EndToStart', re);

      return rc.text.length;
    }
    return 0;
  }
}(jQuery);

