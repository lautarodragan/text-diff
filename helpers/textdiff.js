
function addToTop(el, arr) {
	return [el].concat(arr);
}

function diffLine(line, op) {
	return {line: line, operation: op};
}

function groupDiffLines(lines) {
	if (!lines.length || lines.length < 2)
		return lines;

	var theLines = lines;
	var result = [];
	var savedLine = null;

	while (lines && lines.length) {
		var line = lines.shift();
		console.log('line', line, 'lines', lines);

		if (line.operation == '+' || line.operation == '-') {
			if (savedLine && savedLine.operation != line.operation) {
				var text = '';
				if (line.operation == '+')
					text = savedLine.line + ' | ' + line.line;
				else 
					text = line.line + ' | ' + savedLine.line;
				
				savedLine = null;
				result.push({operation: '*', line: text});
			} else {
				if (savedLine)
					result.push(savedLine);
				savedLine = line;
			}
		} else {
			if (savedLine)
				result.push(savedLine);
			result.push(line);
			savedLine = null;
		}
	}
	
	if (savedLine)
		result.push(savedLine);

	return result;

}

function diffLinesToTextLines(lines, ungroup) {
	var r = [];
	var theLines = ungroup ? lines : groupDiffLines(lines);

	for (var i = 0; i < theLines.length; i++) {
		var line = '';
		
		if (theLines[i].operation)
			line = ' ' + theLines[i].operation + ' ';
		
		line += theLines[i].line;

		r.push(line);
	}

	return r;
}

module.exports = {
	
	textCompare: function(at, bt) {
		// console.log('at', at, 'bt', bt);

		var a = at.split('\n');
		var b = bt.split('\n');
		var r = []; 

		console.log('a', a);
		console.log('b', b);

		console.log(a.length);

		var lastPos = null;
		var lastMatch = null;

		// diffnow seems to go backwards for some reason...
		for (var i = a.length - 1; i >= 0; i--) {
			console.log('searching..', i, a[i], b.indexOf(a[i]));
			var pos = b.indexOf(a[i]);
			if (pos >= 0) {

				// if this is the first match, save the position, we'll use it later
				if (!lastPos)
					lastPos = pos;
				// otherwise let's just sandwitch-in all elements from the right text
				// between the previous match position and this one. 
				else 
					for (var j = lastMatch - 1; j > pos; j--) {
						// r = [' + ' + b[j]].concat(r);	
						r = addToTop(diffLine(b[j], '+'), r);
					}
				
				// a linked list would obviously be more performant, but for the sake of simplicity...
				// r = [a[i]].concat(r);
				r = addToTop(diffLine(a[i], ''), r);

				lastMatch = pos;
			} else {
				// r = [' - ' + a[i]].concat(r);
				r = addToTop(diffLine(a[i], '-'), r);
			}
		}

		// add all the lines from the right text found below the first matched line
		// to the result array. remember we're going backwards.
		for (var i = lastPos + 1; i < b.length; i++)
			// r.push(' + ' + b[i]);
			r.push(diffLine(b[i], '+'));

		// add all the lines from the right text found above the last matched line
		// to the result array. 
		for (var i = lastMatch - 1; i >= 0; i--)
			// r = [' + ' + b[i]].concat(r);
			r = addToTop(diffLine(b[i], '+'), r);

		// return r.join('\n');
		console.log('r', r);
		return diffLinesToTextLines(r, false).join('\n');
	}
}

