app.displayDialogs = DialogModes.NO;

function hasSelection(cDoc) {
	var result = false;
	var cLayer = cDoc.activeLayer;
	var HistInd = cDoc.activeHistoryState;
	cDoc.selection.deselect();

	if (HistInd != cDoc.activeHistoryState) {
		result = true;
		cDoc.activeHistoryState = HistInd;
		cDoc.activeLayer = cLayer;
	}
	return result;
}

function validateState() {
	if (app.documents.length == 0) {
		alert("No document open");
		return false;
	}
	
	if(!hasSelection(app.activeDocument)) {
		alert("Please make a selection to align");
		return false;
	}
	return true;
}	

if(validateState()) {
	app.activeDocument.suspendHistory("Align Right", "alignRight()");
}

function deltaTrans(sDoc, cDoc) {
	var x1 = Array(sDoc.bounds[0].value, cDoc.boundsNoEffects[0].value);
	var y1 = Array(sDoc.bounds[1].value, cDoc.boundsNoEffects[1].value);
	var x2 = Array(sDoc.bounds[2].value, cDoc.boundsNoEffects[2].value);
	var y2 = Array(sDoc.bounds[3].value, cDoc.boundsNoEffects[3].value);

	var cDocCenter = Array(Math.floor(x1[1] + Math.abs((x2[1]-x1[1])/2)), Math.floor(y1[1] + Math.abs((y2[1]-y1[1])/2)));
	var sDocCenter = Array(Math.floor(x1[0] + Math.abs((x2[0]-x1[0])/2)), Math.floor(y1[0] + Math.abs((y2[0]-y1[0])/2)));

	var dx = sDocCenter[0]-cDocCenter[0]+Math.abs((x2[0]-x1[0])/2)-Math.abs((x2[1]-x1[1])/2);
	var dy = sDocCenter[1]-cDocCenter[1];

	var delta = Array(dx, dy);

	return delta;
}

function alignRight() {
	var docRef = app.activeDocument;
	var selRef = docRef.selection;
	var artLayerRef = docRef.activeLayer;
	var textItemRef = null;
	var textItemCopy = "";

	if (artLayerRef.kind == LayerKind.TEXT) {
		textItemRef = artLayerRef.textItem;
		textItemCopy = textItemRef.contents;
		textItemRef.justification = Justification.RIGHT;
		textItemRef.contents = "H";
	}

	var delta = deltaTrans(selRef, artLayerRef);
	artLayerRef.translate(delta[0], delta[1]);
	selRef.deselect();

	if (textItemRef) {
		textItemRef.contents = textItemCopy;
		textItemRef.justification = Justification.RIGHT;
	}
}	