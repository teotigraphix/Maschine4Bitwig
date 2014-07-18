
function View ()
{
	/**
	 * @type {MaschineStudio}
	 */
	this.surface = null;
}

View.prototype = new BaseView ();

View.prototype.onActivate = function() {};

View.prototype.drawGrid = function() {};
View.prototype.onGridChange = function(note, velocity) {};

//--------------------------------------
// Left Buttons
//--------------------------------------

View.prototype.onChannel = function() {};
View.prototype.onPlugin = function() {};

View.prototype.onArrange = function() {};
View.prototype.onMix = function() {};
View.prototype.onBrowse = function() {};
View.prototype.onSampling = function() {};

// Arrow Left/Right page Knob pages

//--------------------------------------
// Center Display
//--------------------------------------

View.prototype.onAll = function() {};
View.prototype.onAuto = function() {};

//View.prototype.onTopRow = function (event, index) {};
//View.prototype.onValueKnob = function (index, value) {};

//--------------------------------------
// Right Buttons/Mixer
//--------------------------------------

View.prototype.onIn1 = function() {};
View.prototype.onIn2 = function() {};
View.prototype.onIn3 = function() {};
View.prototype.onIn4 = function() {};

View.prototype.onMst = function() {};
View.prototype.onGrp = function() {};
View.prototype.onSnd = function() {};
View.prototype.onCue = function() {};

View.prototype.onKnobLarge = function(increment) {}; // master

//--------------------------------------
// Performance
//--------------------------------------

View.prototype.onTap = function() {};
View.prototype.onStepMode = function() {};
View.prototype.onMacro = function() {};
View.prototype.onNoteRepeat = function() {};

//--------------------------------------
// Groups
//--------------------------------------

View.prototype.onGoupButton = function(index) {};

//--------------------------------------
// Transport
//--------------------------------------

View.prototype.onRestart = function() {}; // loop
View.prototype.onMetro = function() {};
View.prototype.onEvents = function() {};
View.prototype.onGrid = function() {}; // rec mode
View.prototype.onPlay = function (event) {};
View.prototype.onRec = function() {};
View.prototype.onErase = function() {};
// onShift()

//--------------------------------------
// Pads
//--------------------------------------

// isPressed
View.prototype.onScene = function() {};
View.prototype.onPattern = function() {};
View.prototype.onPadMode = function() {}; // keyboard
View.prototype.onNavigate = function() {};
View.prototype.onDuplicate = function() {};
View.prototype.onSelect = function() {};
View.prototype.onSolo = function() {};
View.prototype.onMute = function() {}; // choke

// Pads 1..16
View.onGrid = function(index) {};

//--------------------------------------
// Edit
//--------------------------------------

View.prototype.onCopy = function() {};
View.prototype.onPaste = function() {};
View.prototype.onNote = function() {};
View.prototype.onNudge = function() {};
View.prototype.onUndo = function() {}; // step undo
View.prototype.onRedo = function() {}; // step redo
View.prototype.onQuantize = function() {}; // 50%
View.prototype.onClear = function() {}; // clr auto

//--------------------------------------
// Navigate
//--------------------------------------

View.prototype.onJogWheel = function() {};
View.prototype.onJogWheelClick = function() {};
View.prototype.onBack = function() {}; // Shift Button overrides
View.prototype.onEnter = function() {};

//>> leftArrow
//>> rightArrow

View.prototype.onShift = function (event) {};

View.prototype.onUp = function() {};
View.prototype.onDown = function() {};
View.prototype.onLeft = function() {};
View.prototype.onRight = function() {};

















