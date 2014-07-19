
function PlayViewMS ()
{

}

PlayViewMS.prototype = new BaseMaschineView ();

PlayViewMS.prototype.attachTo = function (surface)
{
    //println("PlayViewMS.attachTo() " + surface);
    BaseMaschineView.prototype.attachTo.call (this, surface);

    this.scales = this.model.getScales ();
    this.noteMap = this.scales.getEmptyMatrix ();
    this.pressedKeys = initArray (0, 128);
    this.defaultVelocity = [];
    for (var i = 0; i < 128; i++)
        this.defaultVelocity.push (i);
};

PlayViewMS.prototype.updateNoteMapping = function ()
{
    //println("PlayViewMS.updateNoteMapping()");
    var t = this.model.getTrackBank ().getSelectedTrack ();
    this.noteMap = t != null && t.canHoldNotes ? this.scales.getNoteMatrix () : this.scales.getEmptyMatrix ();
    //println(this.noteMap);
    // Workaround: https://github.com/git-moss/Push4Bitwig/issues/7
    scheduleTask (doObject (this, function () { this.surface.setKeyTranslationTable (this.noteMap); }), null, 100);
};

PlayViewMS.prototype.onActivate = function ()
{
    BaseMaschineView.prototype.onActivate.call (this);

//    this.surface.setButton (PUSH_BUTTON_NOTE, PUSH_BUTTON_STATE_HI);
//    this.surface.setButton (PUSH_BUTTON_SESSION, PUSH_BUTTON_STATE_ON);
//    this.surface.setButton (PUSH_BUTTON_ACCENT, Config.accentActive ? PUSH_BUTTON_STATE_HI : PUSH_BUTTON_STATE_ON);
    this.model.getTrackBank ().setIndication (false);
    this.updateSceneButtons ();
    this.initMaxVelocity ();
};

PlayViewMS.prototype.updateSceneButtons = function (buttonID)
{
    //for (var i = 0; i < 8; i++)
    //    this.push.setButton (PUSH_BUTTON_SCENE1 + i, PUSH_COLOR_BLACK);
};

PlayViewMS.prototype.usesButton = function (buttonID)
{
    return true;
};

PlayViewMS.prototype.drawGrid = function ()
{
    var t = this.model.getTrackBank ().getSelectedTrack ();
    var isKeyboardEnabled = t != null && t.canHoldNotes;
    var isRecording = this.model.getTransport ().isRecording || this.model.getTrackBank ().isClipRecording ();
    for (var i = 36; i < 100; i++)
    {
//        this.surface.pads.light (i, isKeyboardEnabled ? (this.pressedKeys[i] > 0 ?
//            (isRecording ? PUSH_COLOR2_RED_HI : PUSH_COLOR2_GREEN_HI) :
//            this.scales.getColor (this.noteMap, i)) : PUSH_COLOR2_BLACK);
//        this.surface.pads.blink (i, PUSH_COLOR2_BLACK);
    }
};

PlayViewMS.prototype.onGridNote = function (note, velocity)
{
    //println("onGridNote() " + note + ", " + velocity);
    var t = this.model.getTrackBank ().getSelectedTrack ();
    if (t == null || !t.canHoldNotes)
        return;
    // Mark selected notes
    for (var i = 0; i < 128; i++)
    {
        if (this.noteMap[note] == this.noteMap[i])
            this.pressedKeys[i] = velocity;
    }
};

// PlayViewMS.prototype.onOctaveDown = function (event)
// PlayViewMS.prototype.onOctaveUp = function (event)

PlayViewMS.prototype.scrollUp = function (event)
{
    if (this.surface.isShiftPressed ())
        this.model.getApplication ().arrowKeyLeft ();
    else
        this.model.getApplication ().arrowKeyUp ();
};

PlayViewMS.prototype.scrollDown = function (event)
{
    if (this.surface.isShiftPressed ())
        this.model.getApplication ().arrowKeyRight ();
    else
        this.model.getApplication ().arrowKeyDown ();
};

PlayViewMS.prototype.scrollLeft = function (event)
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

PlayViewMS.prototype.scrollRight = function (event)
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

// PlayViewMS.prototype.onAccent = function (event)

PlayViewMS.prototype.initMaxVelocity = function ()
{
    this.maxVelocity = initArray (Config.fixedAccentValue, 128);
    this.maxVelocity[0] = 0;
    this.surface.setVelocityTranslationTable (Config.accentActive ? this.maxVelocity : this.defaultVelocity);
};