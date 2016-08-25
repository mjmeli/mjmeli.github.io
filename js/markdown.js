// markdown.js
// Convert Markdown in HTML files marked by an element with the class "markdown"
// into HTML using the showdown.js library.
//
// Michael Meli

$(document).ready(function() {
    convert_markdown_to_html();
});

function convert_markdown_to_html() {
    $('.markdown').each(function(i, obj) {
        var text = obj.innerHTML;
        converter = new showdown.Converter();
        var html = converter.makeHtml(text);
        obj.innerHTML = html;
    });
}
