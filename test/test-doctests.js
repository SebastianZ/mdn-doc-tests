var testFile = require("sdk/self").data.load("doctests.js")

eval(testFile);

exports["test doc regexp oldURLs"] = function(assert) {
  var str = '<a href="/en/Web">Web</a><a href="/En/Mozilla">Mozilla</a>';
  var test = str.match(docTests["oldURLs"].regex);
  assert.ok(2 == test.length , "test that 'en/' links are matched");
};

exports["test doc regexp emptyElem"] = function(assert) {
  var str = '<p> </p>' +
            '<p> \n\r </p>' +
            '<p> &nbsp;</p>' +
            '<p><br><br/></p>' +
            '<img src="http://example.com/image.png">' +
            '<input value="test"/>' +
            '<p><span>some text</span></p>' +
            '<p>some text</p>';
  var test = docTests["emptyElem"].check(str);
  assert.ok(test.length === 4, "test that empty elements are matched");
};

exports["test doc regexp languagesMacro"] = function(assert) {
  var str = '{{ languages( { "ja": "Ja/Browser_chrome_tests" } ) }}';
  var test = str.match(docTests["languagesMacro"].regex);
  assert.ok(1 == test.length , "test that the {{languages}} macro is matched");
};

exports["test doc regexp emptyBrackets"] = function(assert) {
  var str = '{{ foo() }} {{bar()}} {{foobar("abc")}} {{baz}}';
  var test = str.match(docTests["emptyBrackets"].regex);
  assert.ok(2 == test.length , "test that {{foo()}} macros are matched");
};

exports["test doc regexp styleAttribute"] = function(assert) {
  var str = '<span style=""></span>' +
            '<div style="margin-top:5%"></div>' +
            '<section style="background:#fff; color: rgb(234, 234, 234);"></section>' +
            '<b style=\'padding: 5px !important\'>test</b>' +
            '<span style="font-family: \'Open Sans\', serif; line-height: 1.5"></span>';
  var test = str.match(docTests["styleAttribute"].regex);
  assert.ok(5 == test.length , "test that style= attributes are matched");
};

exports["test doc regexp nameAttribute"] = function(assert) {
  var str = '<span name=""></span>' +
            '<div name="foo"></div>' +
            '<h2 id="foo" name="foo">foo</h2>' +
            '<h2 id="foo_bar" name="foo_bar">foo bar</h2>' +
            '<h3 name=\'baz\'>baz</h3>';
  var test = str.match(docTests["nameAttribute"].regex);
  assert.ok(5 == test.length , "test that name= attributes are matched");
};

exports["test doc regexp spanCount"] = function(assert) {
  var str = '<span>what?</span>' +
            '<p>nope</p>' +
            '<span class="foo" style="font:10px">bar</span>' +
            '<span><dt>foobar</dt></span>' +
            '<span class="seoSummary">seoseoseo</span>';
  var test = docTests["spanCount"].check(str);
  assert.ok(3 == test.length , "test that <span> elements are found");
};

exports["test doc regexp preWithoutClass"] = function(assert) {
  var str = '<pre class="brush: js"></pre>' +
            '<pre>foobar;</pre>' +
            '<pre class="syntaxbox"></pre>' +
            '<pre id="foo"></pre>' +
            "<pre> \n\r foo</pre>";
  var test = str.match(docTests["preWithoutClass"].regex);
  assert.ok(3 == test.length , "test that <pre> elements w/o syntax highlighter are found");
};

exports["test doc regexp summaryHeading"] = function(assert) {
  var str = '<h2>Summary</h2>' +
            '<h2 id="Summary" name="Summary">Summary</h2>' +
            '<h2 id="Summary" name="foo">Summary</h2>' +
            '<h3 id="Summary">Summary</h3>';
  var test = str.match(docTests["summaryHeading"].regex);
  assert.ok(4 == test.length , "test that Summary headings are matched");
};

exports["test doc regexp jsRefWithParams"] = function(assert) {
  var str = '{{JSRef()}}' +
            '{{JSRef("Global_Objects")}}' +
            '{{JSRef("Global_Objects", "Math")}}' +
            '{{JSRef}}';
  var test = str.match(docTests["jsRefWithParams"].regex);
  assert.ok(3 == test.length , "test that JSRef macros with parameters are matched");
};

exports["test doc regexp exampleColonHeading"] = function(assert) {
  var str = '<h2>Example</h2>' +
            '<h3 id="Example">Example</h3>' +
            '<h3 id="Example:_Foo">Example: Foo</h3>' +
            '<h3 id="Example:_Using_Math.sin">Example: Using <code>Math.sin</code></h3>' +
            '<h2 id="Example:_Foo">Example: Foo</h2>';
  var test = str.match(docTests["exampleColonHeading"].regex);
  assert.ok(3 == test.length , "test that headings with _Example:_ are matched");
};

exports["test doc regexp alertPrintInCode"] = function(assert) {
  var str = '<pre>alert("foo")</pre>' +
            '<pre class="syntaxbox">print("bar")</pre>' +
            '<pre>var someOthercode = baz; ' +
            'alert("hello world"); \n var moreCode;</pre>' +
            '<pre>document.write("foobar");</pre>';
  var test = docTests["alertPrintInCode"].check(str);
  assert.ok(4 == test.length , "test that alert, print, eval and d.write statements are matched");
};

exports["test doc regexp htmlComments"] = function(assert) {
  var str = '<!-- -->' +
            '<!-- <span>foo</span> -->' +
            '<!-- hello \n world -->';
  var test = str.match(docTests["htmlComments"].regex);
  assert.ok(3 == test.length , "test that html comments are matched");
};

exports["test doc regexp fontElement"] = function(assert) {
  var str = '<font>' +
            '<font face="Open Sans, sans-serif">';
  var test = str.match(docTests["fontElement"].regex);
  assert.ok(2 === test.length, "test that <font> tags are matched");
};

exports["test doc httpLinks"] = function(assert) {
  var str = '<a href="https://somepage.com">some page</a>' +
            '<a href="ftp://somepage.com">some page</a>' +
            '<a href="https://somepage.com?url=http://anotherpage.com">some page</a>' +
            '<a href="http://somepage.com">some page</a>';
  var test = str.match(docTests["httpLinks"].regex);
  assert.ok(test.length === 1, "test that HTTP links are matched");
};

exports["test doc macroSyntaxError"] = function(assert) {
  var str = '{{macro}}' +
            '{{ macro }}' +
            '{{macro("param")}}' +
            '{{ macro("param") }}' +
            '{{macro(123)}}' +
            '{{macro(123, "param")}}' +
            '{{macro(\'param\', 123, "param")}}' +
            '{{macro("param)}}' + // Missing closing double quote
            '{{macro(\'param)}}' + // Missing closing single quote
            '{{macro(param)}}' + // Missing quotes
            '{{macro(param")}}' + // Missing opening double quote
            '{{macro(param\')}}' + // Missing opening single quote
            '{{macro(\'param\', 123, "param)}}' + // Missing closing double quote, multiple parameters
            '{{macro("param"))}}' + // Double closing parameter list bracket
            '{{macro("param")}' + // Missing closing macro curly brace after double quoted parameter
            '{{macro(\'param\')}' + // Missing closing macro curly brace after single quoted parameter
            '{{macro("param"}}' + // Missing closing parameter list bracket after double quoted parameter
            '{{macro(\'param\'}}' + // Missing closing parameter list bracket after single quoted parameter
            '{{macro(param"}}' + // Missing opening double quote and missing closing parameter list bracket
            '{{macro(param"))}}'; // Missing opening double quote and double closing parameter list bracket
  var test = docTests["macroSyntaxError"].check(str);
  assert.ok(test.length === 15, "test that macro syntax errors are recognized");
};

exports["test doc wrongHighlightedLine"] = function(assert) {
  var str = '<pre class="brush: js; highlight[2];">bla\nblubb</pre>' +
            '<pre class="brush:js;">bla\nblubb</pre>' +
            '<pre class="highlight[1]; brush:js;">bla\nblubb</pre>' +
            '<pre class="brush: js; highlight[0];">bla\nblubb</pre>' +
            '<pre class="brush: js; highlight[-1];">bla\nblubb</pre>' +
            '<pre class="brush: js; highlight[3];">bla\nblubb</pre>' +
            '<pre class="brush: js; highlight[3];">bla<br>blubb</pre>' +
            '<pre class="brush: js; highlight[3];">bla<br/>blubb</pre>';
  var test = docTests["wrongHighlightedLine"].check(str);
  assert.ok(test.length === 5, "test that highlighted code line number is valid " + test.length);
};

exports["test doc headlinesWording"] = function(assert) {
  var str = '<h2 id="Syntax">Syntax</h2>' +
            '<h3>Errors</h3>' +
            '<h3>Returns</h3>' +
            '<h3>Parameters</h3>';
  var test = docTests["headlinesWording"].check(str);
  assert.ok(test.length === 4, "test that wrong Syntax sub-headings and a order of them is recognized");
};

exports["test doc codeInPre"] = function(assert) {
  var str = '<pre>no code</pre>' +
            '<pre class="brush:js">no code</pre>' +
            '<pre class="brush:js"><code>some code</code></pre>' +
            '<pre class="brush:js"><code>some code</code><code>some more inline code</code></pre>' +
            '<pre class="brush:js">foo\n<code>some code</code>\nbar<br>\n<code>some code with\nline break</code>\nbaz</pre>';
  var test = docTests["codeInPre"].check(str);
  assert.ok(test.length === 5, "test that <code> elements within <pre> blocks are matched");
};

require("sdk/test").run(exports);