/**
 * jquery.editablediv.js
 *
 * Copyright (c) 2015 Phitha Tanpairoj <ptanpairoj@yahoo.com>
 *
 * https://github.com/phitha/editableDiv
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

;(function($) {
	$.fn.editableDiv = function(placeholder) {
		$(this).attr("contenteditable", true);
		$(this).attr("len", $(this).text().trim().length);
		$(this).attr("stage", "");
		if (placeholder != "") $(this).attr("placeholder", placeholder);

		if ($(this).text().trim() == "") {
			$(this).html("<span style='color: #eee;'>"+$(this).attr("placeholder")+"</span>");
			$(this).attr("len", 0);
		} else {
			$(this).attr("len", $(this).text().trim().length);
			$(this).attr("stage", "edit");
		}
		
		$(this)
			.focusin(function() {
				if ($(this).attr("stage") == "") {
					var target = $(this);
					window.setTimeout(function() { target.html(""); }, 10);
				}
			})
			.focusout(function() {
				if ($(this).attr("stage") == "") $(this).html("<span style='color: #ddd;'>"+$(this).attr("placeholder")+"</span>");
			})
			.keydown(function(e) {
				if ($(this).attr("stage") == "" && e.keyCode != 9) {
					if ($(this).attr("len") == 0) { $(this).html(""); $(this).attr("stage", "edit");}
				}
			})
			.keyup(function(e) {
				currentlength = $(this).text().length;
				if (currentlength == 0) $(this).attr("stage", "");
				$(this).attr("len", currentlength);
			});
		
		
		return this;
	}
})(jQuery);