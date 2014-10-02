


//--------------------------------------
// Left Buttons
//--------------------------------------

AbstractView.prototype.onChannel = function() {};
AbstractView.prototype.onPlugin = function() {};

AbstractView.prototype.onArrange = function (event)
{
    this.refreshButton (MaschineButton.ARRANGE, event);
    if (!event.isDown())
        return;
    var app = this.model.getApplication ();
    app.setPanelLayout ('ARRANGE');
};

AbstractView.prototype.onMix = function (event)
{
    this.refreshButton (MaschineButton.MIX, event);
    if (!event.isDown())
        return;
    var app = this.model.getApplication ();
    app.setPanelLayout ('MIX');
};

AbstractView.prototype.onBrowse = function () {};

AbstractView.prototype.onSampling = function (event)
{
    this.refreshButton (MaschineButton.SAMPLING, event);
    if (!event.isDown())
        return;
    var app = this.model.getApplication ();
    app.setPanelLayout ('EDIT');
};

// Arrow Left/Right page Knob pages

//--------------------------------------
// Center Display
//--------------------------------------

AbstractView.prototype.onAll = function() {};
AbstractView.prototype.onAuto = function() {};

//AbstractView.prototype.onFirstRow = function (event, index) {};
//AbstractView.prototype.onValueKnob = function (index, value) {};

//--------------------------------------
// Right Buttons/Mixer
//--------------------------------------

AbstractView.prototype.onIn1 = function() {};
AbstractView.prototype.onIn2 = function() {};
AbstractView.prototype.onIn3 = function() {};
AbstractView.prototype.onIn4 = function() {};

AbstractView.prototype.onMst = function() {};
AbstractView.prototype.onGrp = function() {};
AbstractView.prototype.onSnd = function() {};
AbstractView.prototype.onCue = function() {};

AbstractView.prototype.onEncoderLarge = function (value)
{
    this.model.getMasterTrack ().changeVolume (value, this.surface.getFractionValue ());
};

//--------------------------------------
// Performance
//--------------------------------------

AbstractView.prototype.onTap = function (event)
{
    // TODO fix first press, should not change tmepo
    this.refreshButton (MaschineButton.TAP, event);

    if (!event.isLong () && event.isDown ())
    {
        this.model.getTransport ().tapTempo ();
    }
};

AbstractView.prototype.tapDelayReset = function ()
{
    //scheduleTask()
};

AbstractView.prototype.onStepMode = function()
{
    if (!event.isDown ())
        return;

    println("Step Mode");
    if (!this.surface.isActiveView (MaschineStudio.VIEW_SEQUENCER))
    {
        this.surface.setActiveView (MaschineStudio.VIEW_SEQUENCER);
    }
};

AbstractView.prototype.onMacro = function() {};
AbstractView.prototype.onNoteRepeat = function() {};

//--------------------------------------
// Groups
//--------------------------------------

AbstractView.prototype.onGoupButton = function (event, index)
{
    this.refreshButton (44 + index, event);

    switch (index)
    {
        case 0:
            break;

        case 1:
            break;

        case 2:
            this.onUp (event);
            break;

        case 3:
            break;

        case 4:
            break;

        case 5:
            this.onLeft (event);
            break;

        case 6:
            this.onDown (event);
            break;

        case 7:
            this.onRight (event);
            break;
    }
};

//--------------------------------------
// Transport
//--------------------------------------

AbstractView.prototype.onRestart = function (event)
{
    this.refreshButton (MaschineButton.RESTART, event);

    if (this.surface.isShiftPressed ()) {
        this.model.getTransport ().stop ();
        this.model.getTransport ().setPosition (0);
    }
    else
        this.model.getTransport ().restart ();
}; // loop

AbstractView.prototype.onMetro = function (event)
{
    if (event.isDown ())
        this.model.getTransport ().toggleClick ();
};

// TODO BaseMaschineView.prototype.onEvents = function () {};
// TODO BaseMaschineView.prototype.onGrid = function () {}; // rec mode

AbstractView.prototype.onPlay = function (event)
{
    this.refreshButton (MaschineButton.PLAY, event);

    if (!event.isDown ())
        return;

    if (this.surface.isShiftPressed ())
        this.model.getTransport ().toggleLoop ();
    else
        this.model.getTransport ().play ();
};

AbstractView.prototype.onRec = function (event)
{
    if (!event.isDown ())
        return;

    if (this.surface.isShiftPressed ())
        this.model.getTransport ().toggleLauncherOverdub ();
    else
        this.model.getTransport ().record ();
};

AbstractView.prototype.onErase = function (event)
{
    this.refreshButton (MaschineButton.ERASE, event);

    if (event.isDown ())
        this.model.getApplication ().deleteSelection ();
};

AbstractView.prototype.onShift = function (event)
{
    this.refreshButton (MaschineButton.SHIFT, event);

    this.surface.setButton (MaschineButton.SHIFT, event.isUp () ? MaschineButton.STATE_UP : MaschineButton.STATE_DOWN);
};

//--------------------------------------
// Pads
//--------------------------------------

AbstractView.prototype.onScene = function (event)
{
    if (!event.isDown ())
        return;

    println("Session Mode");
    if (!this.surface.isActiveView (MaschineStudio.VIEW_SESSION))
    {
        this.surface.setActiveView (MaschineStudio.VIEW_SESSION);
    }
};

AbstractView.prototype.onPattern = function() {};

AbstractView.prototype.onPadMode = function (event) // keyboard
{
    if (!event.isDown ())
        return;

    println("Pad Mode");
    if (!this.surface.isActiveView (MaschineStudio.VIEW_PLAY))
    {
        this.surface.setActiveView (MaschineStudio.VIEW_PLAY);
    }
};

AbstractView.prototype.onNavigate = function () {};
AbstractView.prototype.onDuplicate = function () {};
AbstractView.prototype.onSelect = function () {};
AbstractView.prototype.onSolo = function () {};
AbstractView.prototype.onMute = function () {}; // choke

// Pads 1..16
AbstractView.onGrid = function (index) {};

//--------------------------------------
// Edit
//--------------------------------------

AbstractView.prototype.onCopy = function() {};
AbstractView.prototype.onPaste = function() {};
AbstractView.prototype.onNote = function() {};
AbstractView.prototype.onNudge = function() {};

AbstractView.prototype.onUndo = function (event) // step undo
{
    this.refreshButton (MaschineButton.UNDO, event);

    if (!event.isDown ())
        return;

    this.model.getApplication ().undo ();
};

AbstractView.prototype.onRedo = function (event) // step redo
{
    this.refreshButton (MaschineButton.REDO, event);

    if (!event.isDown ())
        return;

    this.model.getApplication ().redo ();
};

AbstractView.prototype.onQuantize = function() {}; // 50%
AbstractView.prototype.onClear = function() {}; // clr auto

//--------------------------------------
// Navigate
//--------------------------------------

AbstractView.prototype.onJogWheel = function (event, increase)
{
    if (this.surface.isPressed (MaschineButton.TAP))
        this.model.getTransport ().changeTempo (increase);
};

// TODO AbstractView.prototype.onJogWheelClick = function() {};
AbstractView.prototype.onBack = function() {};
// TODO AbstractView.prototype.onEnter = function() {}; // Shift Button overrides

AbstractView.prototype.onLeftArrow = function (event) {};
AbstractView.prototype.onRightArrow = function (event) {};

AbstractView.prototype.onShift = function (event)
{
    this.refreshButton (MaschineButton.SHIFT, event);
};