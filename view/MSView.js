
function MSView ()
{
    View.call (this);

    // override in subclass with specific Config value
    // TODO Eventually needs to listen to a config property change
    this.scrollerInterval = 100;

    this.scrollerLeft = new TimerTask (this, this.scrollLeft, this.scrollerInterval);
    this.scrollerRight = new TimerTask (this, this.scrollRight, this.scrollerInterval);
    this.scrollerUp = new TimerTask (this, this.scrollUp, this.scrollerInterval);
    this.scrollerDown = new TimerTask (this, this.scrollDown, this.scrollerInterval);
}

MSView.prototype = new View ();

MSView.prototype.attachTo = function (surface)
{
    println("MSView.attachTo() " + surface);
    BaseView.prototype.attachTo.call (this, surface);

    this.scales = this.model.getScales ();
    this.noteMap = this.scales.getEmptyMatrix ();
    this.pressedKeys = initArray (0, 128);
    this.defaultVelocity = [];
    for (var i = 0; i < 128; i++)
        this.defaultVelocity.push (i);
};

MSView.prototype.updateNoteMapping = function ()
{
    var t = this.model.getTrackBank ().getSelectedTrack ();
    this.noteMap = t != null && t.canHoldNotes ? this.scales.getNoteMatrix () : this.scales.getEmptyMatrix ();
    // Workaround: https://github.com/git-moss/Push4Bitwig/issues/7
    scheduleTask (doObject (this, function () { this.push.setKeyTranslationTable (this.noteMap); }), null, 100);
};

MSView.prototype.updateDevice = function ()
{
    var t = this.model.getTransport ();

    this.surface.setButton (MaschineButton.METRO, t.isClickOn ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.PLAY, t.isPlaying ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.REC, t.isRecording ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);
};

MSView.prototype.onGrid = function (note, velocity)
{
    var t = this.model.getTrackBank ().getSelectedTrack ();
    if (t == null || !t.canHoldNotes)
        return;
    println("onGrid() " + note + ", " + velocity);
    // Mark selected notes
    for (var i = 0; i < 128; i++)
    {
        if (this.noteMap[note] == this.noteMap[i])
            this.pressedKeys[i] = velocity;
    }
};

//--------------------------------------
// Performance
//--------------------------------------

MSView.prototype.onTap = function (event)
{
    // TODO fix first press, should not change tmepo
    this.surface.setButton (MaschineButton.TAP, event.isDown () || event.isLong ()
        ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);

    if (event.isDown ())
        this.model.getTransport ().tapTempo ();
};

MSView.prototype.onStepMode = function() {};
MSView.prototype.onMacro = function() {};
MSView.prototype.onNoteRepeat = function() {};

//--------------------------------------
// Groups
//--------------------------------------

MSView.prototype.onGoupButton = function (event, index)
{
    this.surface.setButton (44 + index, event.isDown () || event.isLong ()
        ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);

    switch (index)
    {
        case 0:
            break;

        case 1:
            this.onArrowUp (event);
            break;

        case 2:
            break;

        case 3:
            break;

        case 4:
            this.onArrowLeft (event);
            break;

        case 5:
            this.onArrowDown (event);
            break;

        case 6:
            this.onArrowRight (event);
            break;

        case 7:
            break;
    }
};

MSView.prototype.onArrowUp = function (event)
{
    if (event.isDown ())
    {
        this.scrollUp (event);
    }
    else if (event.isLong ())
    {
        this.scrollerUp.start ([event]);
    }
    else if (event.isUp ())
    {
        this.scrollerUp.stop ();
    }
};

MSView.prototype.onArrowDown = function (event)
{
    if (event.isDown ())
    {
        this.scrollDown (event);
    }
    else if (event.isLong ())
    {
        this.scrollerDown.start ([event]);
    }
    else if (event.isUp ())
    {
        this.scrollerDown.stop ();
    }
};

MSView.prototype.onArrowLeft = function (event)
{
    if (event.isDown ())
    {
        this.scrollLeft (event);
    }
    else if (event.isLong ())
    {
        this.scrollerLeft.start ([event]);
    }
    else if (event.isUp ())
    {
        this.scrollerLeft.stop ();
    }
};

MSView.prototype.onArrowRight = function (event)
{
    if (event.isDown ())
    {
        this.scrollRight (event);
    }
    else if (event.isLong ())
    {
        this.scrollerRight.start ([event]);
    }
    else if (event.isUp ())
    {
        this.scrollerRight.stop ();
    }
};

//--------------------------------------
// Transport
//--------------------------------------

MSView.prototype.onRestart = function (event)
{
    this.surface.setButton (MaschineButton.RESTART, event.isDown () || event.isLong ()
        ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);

    this.model.getTransport ().restart ();
}; // loop

MSView.prototype.onMetro = function (event)
{
    if (event.isDown ())
        this.model.getTransport ().toggleClick ();
};

// TODO MSView.prototype.onEvents = function () {};
// TODO MSView.prototype.onGrid = function () {}; // rec mode

MSView.prototype.onPlay = function (event)
{
    if (!event.isDown ())
        return;

    this.model.getTransport ().play ();
};

MSView.prototype.onRec = function (event)
{
    if (!event.isDown ())
        return;

    if (this.surface.isShiftPressed ())
        this.model.getTransport ().toggleLauncherOverdub ();
    else
        this.model.getTransport ().record ();
};

MSView.prototype.onErase = function (event)
{
    this.surface.setButton (MaschineButton.ERASE, event.isDown () || event.isLong ()
        ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);

    if (event.isDown ())
        this.model.getApplication ().deleteSelection ();
};

MSView.prototype.onShift = function (event)
{
    this.surface.setButton (MaschineButton.SHIFT, event.isUp () ? MaschineButton.STATE_UP : MaschineButton.STATE_DOWN);
};

//--------------------------------------
// Navigate
//--------------------------------------

MSView.prototype.onJogWheel = function (event, increase)
{
    println(increase);
    if (this.surface.isPressed (MaschineButton.TAP))
        this.model.getTransport ().changeTempo (increase);
};

// TODO MSView.prototype.onJogWheelClick = function() {};
// TODO MSView.prototype.onBack = function() {}; // Shift Button overrides
// TODO MSView.prototype.onEnter = function() {};

//>> leftArrow
//>> rightArrow




//--------------------------------------
// Protected API
//--------------------------------------

// implemented for Arrow scrolling in subclass Views
// MSView.prototype.scrollUp = function (event) {};
// MSView.prototype.scrollDown = function (event) {};
MSView.prototype.scrollLeft = function (event) {};
MSView.prototype.scrollRight = function (event) {};

MSView.prototype.scrollUp = function (event)
{
    if (this.surface.isShiftPressed ())
        this.model.getApplication ().arrowKeyLeft ();
    else
        this.model.getApplication ().arrowKeyUp ();
};

MSView.prototype.scrollDown = function (event)
{
    if (this.surface.isShiftPressed ())
        this.model.getApplication ().arrowKeyRight ();
    else
        this.model.getApplication ().arrowKeyDown ();
};

MSView.prototype.scrollLeft = function (event)
{
    if (this.surface.getCurrentMode () == MODE_DEVICE /*|| this.surface.getCurrentMode () == */)
        this.model.getCursorDevice ().selectPrevious ();
    else
    {
        var sel = this.model.getTrackBank ().getSelectedTrack ();
        var index = sel == null ? 0 : sel.index - 1;
        if (index == -1)
        {
            if (!this.model.getTrackBank ().canScrollTracksUp ())
                return;
            this.model.getTrackBank ().scrollTracksPageUp ();
            scheduleTask (doObject (this, this.selectTrack), [7], 75);
            return;
        }
        this.selectTrack (index);
    }
};

MSView.prototype.scrollRight = function (event)
{
    if (this.surface.getCurrentMode () == MODE_DEVICE /*|| this.surface.getCurrentMode () == MODE_PRESET*/)
        this.model.getCursorDevice ().selectNext ();
    else
    {
        var sel = this.model.getTrackBank ().getSelectedTrack ();
        var index = sel == null ? 0 : sel.index + 1;
        if (index == 8)
        {
            var tb = this.model.getTrackBank ();
            if (!tb.canScrollTracksDown ())
                return;
            tb.scrollTracksPageDown ();
            scheduleTask (doObject (this, this.selectTrack), [0], 75);
        }
        this.selectTrack (index);
    }
};

MSView.prototype.selectTrack = function (index)
{
    this.model.getTrackBank ().select (index);
};
