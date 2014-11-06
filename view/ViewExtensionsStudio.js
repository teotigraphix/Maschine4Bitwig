
AbstractView.prototype.onChannel = function () {};
AbstractView.prototype.onPlugin = function () {};

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

AbstractView.prototype.onSampling = function (event)
{
    this.refreshButton (MaschineButton.SAMPLING, event);
    if (!event.isDown())
        return;
    var app = this.model.getApplication ();
    app.setPanelLayout ('EDIT');
};

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
    this.refreshButton (MaschineButton.TAP, event);

    if (event.isLong ())
    {
        this.showTempo ();
        return;
    }

    if (event.isDown ())
    {
        this.model.getTransport ().tapTempo ();
    }
};

AbstractView.prototype.onStepMode = function()
{
//    if (!event.isDown ())
//        return;
//
//    println("Step Mode");
//    if (!this.surface.isActiveView (Maschine.VIEW_SEQUENCER))
//    {
//        this.surface.setActiveView (Maschine.VIEW_SEQUENCER);
//    }
};

AbstractView.prototype.onMacro = function() {};

//--------------------------------------
// Groups
//--------------------------------------


//--------------------------------------
// Transport
//--------------------------------------

AbstractView.prototype.onMetro = function (event)
{
    // deregister action if long for jogwheel metro volume adjustment
    if (event.isLong ())
    {
        this.surface.setButtonConsumed (MaschineButton.METRO);
        return;
    }

    // only except releases to toggle metro
    if (event.isDown ())
        return;

    if (!this.surface.isShiftPressed ())
        this.model.getTransport ().toggleClick ();
    else
        this.model.getTransport ().toggleMetronomeTicks ();
};

// TODO BaseMaschineView.prototype.onEvents = function () {};
// TODO BaseMaschineView.prototype.onGrid = function () {}; // rec mode

AbstractView.prototype.onPlay = function (event)
{
    this.refreshButton (MaschineButton.PLAY, event);

    if (!event.isDown ())
        return;

    this.model.getTransport ().play ();
};

AbstractView.prototype.onErase = function (event)
{
    this.refreshButton (MaschineButton.ERASE, event);

    if (event.isDown ())
        this.model.getApplication ().deleteSelection ();
};


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
        this.model.getTransport ().changeTempo (increase, this.surface.isShiftPressed ());
    else if (this.surface.isPressed (MaschineButton.METRO))
        this.model.getTransport ().changeMetronomeVolume (increase ? 1 : 127, Config.fractionValue);
};

// TODO AbstractView.prototype.onJogWheelClick = function() {};
AbstractView.prototype.onBack = function() {};
// TODO AbstractView.prototype.onEnter = function() {}; // Shift Button overrides

