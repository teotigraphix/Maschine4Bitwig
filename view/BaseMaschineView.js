
function BaseMaschineView ()
{
    BaseView.call (this);
}

BaseMaschineView.prototype = new BaseView ();

//--------------------------------------
// Left Buttons
//--------------------------------------

BaseMaschineView.prototype.onChannel = function() {};
BaseMaschineView.prototype.onPlugin = function() {};

BaseMaschineView.prototype.onArrange = function() {};
BaseMaschineView.prototype.onMix = function() {};
BaseMaschineView.prototype.onBrowse = function() {};
BaseMaschineView.prototype.onSampling = function() {};

// Arrow Left/Right page Knob pages

//--------------------------------------
// Center Display
//--------------------------------------

BaseMaschineView.prototype.onAll = function() {};
BaseMaschineView.prototype.onAuto = function() {};

//BaseView.prototype.onFirstRow = function (event, index) {};
//BaseView.prototype.onValueKnob = function (index, value) {};

//--------------------------------------
// Right Buttons/Mixer
//--------------------------------------

BaseMaschineView.prototype.onIn1 = function() {};
BaseMaschineView.prototype.onIn2 = function() {};
BaseMaschineView.prototype.onIn3 = function() {};
BaseMaschineView.prototype.onIn4 = function() {};

BaseMaschineView.prototype.onMst = function() {};
BaseMaschineView.prototype.onGrp = function() {};
BaseMaschineView.prototype.onSnd = function() {};
BaseMaschineView.prototype.onCue = function() {};

BaseMaschineView.prototype.onKnobLarge = function(increment) {}; // master

//--------------------------------------
// Performance
//--------------------------------------

BaseMaschineView.prototype.onTap = function (event)
{
    // TODO fix first press, should not change tmepo
    this.surface.setButton (MaschineButton.TAP, event.isDown () || event.isLong ()
        ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);

    if (event.isDown ())
        this.model.getTransport ().tapTempo ();
};

BaseMaschineView.prototype.onStepMode = function() {};
BaseMaschineView.prototype.onMacro = function() {};
BaseMaschineView.prototype.onNoteRepeat = function() {};

//--------------------------------------
// Groups
//--------------------------------------

BaseMaschineView.prototype.onGoupButton = function (event, index)
{
    this.surface.setButton (44 + index, event.isDown () || event.isLong ()
        ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);

    switch (index)
    {
        case 0:
            break;

        case 1:
            this.onUp (event);
            break;

        case 2:
            break;

        case 3:
            break;

        case 4:
            this.onLeft (event);
            break;

        case 5:
            this.onDown (event);
            break;

        case 6:
            this.onRight (event);
            break;

        case 7:
            break;
    }
};

//--------------------------------------
// Transport
//--------------------------------------

BaseMaschineView.prototype.onRestart = function (event)
{
    this.surface.setButton (MaschineButton.RESTART, event.isDown () || event.isLong ()
        ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);

    this.model.getTransport ().restart ();
}; // loop

BaseMaschineView.prototype.onMetro = function (event)
{
    if (event.isDown ())
        this.model.getTransport ().toggleClick ();
};

// TODO BaseMaschineView.prototype.onEvents = function () {};
// TODO BaseMaschineView.prototype.onGrid = function () {}; // rec mode

BaseMaschineView.prototype.onPlay = function (event)
{
    if (!event.isDown ())
        return;

    this.model.getTransport ().play ();
};

BaseMaschineView.prototype.onRec = function (event)
{
    if (!event.isDown ())
        return;

    if (this.surface.isShiftPressed ())
        this.model.getTransport ().toggleLauncherOverdub ();
    else
        this.model.getTransport ().record ();
};

BaseMaschineView.prototype.onErase = function (event)
{
    this.surface.setButton (MaschineButton.ERASE, event.isDown () || event.isLong ()
        ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);

    if (event.isDown ())
        this.model.getApplication ().deleteSelection ();
};

BaseMaschineView.prototype.onShift = function (event)
{
    this.surface.setButton (MaschineButton.SHIFT, event.isUp () ? MaschineButton.STATE_UP : MaschineButton.STATE_DOWN);
};

//--------------------------------------
// Pads
//--------------------------------------

// isPressed
BaseMaschineView.prototype.onScene = function() {};
BaseMaschineView.prototype.onPattern = function() {};
BaseMaschineView.prototype.onPadMode = function() {}; // keyboard
BaseMaschineView.prototype.onNavigate = function() {};
BaseMaschineView.prototype.onDuplicate = function() {};
BaseMaschineView.prototype.onSelect = function() {};
BaseMaschineView.prototype.onSolo = function() {};
BaseMaschineView.prototype.onMute = function() {}; // choke

// Pads 1..16
BaseMaschineView.onGrid = function(index) {};

//--------------------------------------
// Edit
//--------------------------------------

BaseMaschineView.prototype.onCopy = function() {};
BaseMaschineView.prototype.onPaste = function() {};
BaseMaschineView.prototype.onNote = function() {};
BaseMaschineView.prototype.onNudge = function() {};
BaseMaschineView.prototype.onUndo = function() {}; // step undo
BaseMaschineView.prototype.onRedo = function() {}; // step redo
BaseMaschineView.prototype.onQuantize = function() {}; // 50%
BaseMaschineView.prototype.onClear = function() {}; // clr auto

//--------------------------------------
// Navigate
//--------------------------------------

BaseMaschineView.prototype.onJogWheel = function (event, increase)
{
    if (this.surface.isPressed (MaschineButton.TAP))
        this.model.getTransport ().changeTempo (increase);
};

// TODO BaseMaschineView.prototype.onJogWheelClick = function() {};
// TODO BaseMaschineView.prototype.onBack = function() {}; // Shift Button overrides
// TODO BaseMaschineView.prototype.onEnter = function() {};

//>> leftArrow
//>> rightArrow

BaseMaschineView.prototype.onShift = function (event) {};

BaseMaschineView.prototype.updateButtons = function ()
{
    BaseView.prototype.updateButtons.call (this);

    var t = this.model.getTransport ();

    this.surface.setButton (MaschineButton.METRO, t.isClickOn ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.PLAY, t.isPlaying ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.REC, t.isRecording ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);
};