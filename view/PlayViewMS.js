// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function PlayViewMS (model)
{
    BaseMaschineView.call (this, model);
}

PlayViewMS.prototype = new BaseMaschineView ();

PlayViewMS.prototype.attachTo = function (surface)
{
    //println("PlayViewMS.attachTo() " + surface);
    AbstractView.prototype.attachTo.call (this, surface);

    this.scales = this.model.getScales ();
    this.noteMap = this.scales.getEmptyMatrix ();
    this.pressedKeys = initArray (0, 128);
    this.defaultVelocity = [];
    for (var i = 0; i < 128; i++)
        this.defaultVelocity.push (i);
};

PlayViewMS.prototype.updateNoteMapping = function ()
{
    var t = this.model.getTrackBank ().getSelectedTrack ();
    this.noteMap = t != null && t.canHoldNotes ? this.scales.getNoteMatrix () : this.scales.getEmptyMatrix ();
    // Workaround
    scheduleTask (doObject (this, function () { this.surface.setKeyTranslationTable (this.noteMap); }), null, 100);
};

PlayViewMS.prototype.clearNoteMapping = function ()
{
    this.noteMap = this.scales.getEmptyMatrix ();
    // Workaround
    scheduleTask (doObject (this, function () { this.surface.setKeyTranslationTable (this.noteMap); }), null, 100);
};

PlayViewMS.prototype.onActivate = function ()
{
    AbstractView.prototype.onActivate.call (this);
    this.surface.setButton (MaschineButton.PAD_MODE, MaschineButton.STATE_DOWN);
    this.surface.setButton (MaschineButton.STEP_MODE, MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.SCENE, MaschineButton.STATE_UP);
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
    if (this.surface.isActiveMode(Maschine.MODE_NAVIGATE))
    {

        scheduleTask (doObject (this, function () {


            var cursorDevice = this.model.getCursorDevice();
            var names = cursorDevice.parameterPageNames;
            for (var i = 36; i < 52; i++)
            {
                if (i < 36 + names.length)
                    this.surface.pads.light (i, COLOR.PLAY);
                else
                    this.surface.pads.light (i, COLOR.OFF);
            }


        }), null, 100);


        return;
    }
    var isKeyboardEnabled = this.canSelectedTrackHoldNotes ();
    var isRecording = this.model.hasRecordingState ();

    for (var i = 36; i < 52; i++)
    {
        this.surface.pads.light (i, isKeyboardEnabled ? (this.pressedKeys[i] > 0 ?
            (isRecording ? COLOR.ARM : COLOR.PLAY) :
            this.scales.getColor (this.noteMap, i)) : COLOR.OFF, null, false);
    }
};

PlayViewMS.prototype.onGridNote = function (note, velocity)
{
    if (this.surface.isActiveMode(Maschine.MODE_NAVIGATE))
    {
        if (velocity > 0)
        {
            var cursorDevice = this.model.getCursorDevice();
            cursorDevice.setParameterPage(note - 36);
        }
    }

    if (!this.canSelectedTrackHoldNotes ())
        return;
    // Mark selected notes
    for (var i = 0; i < 128; i++)
    {
        if (this.noteMap[note] == this.noteMap[i])
            this.pressedKeys[i] = velocity;
    }
};


PlayViewMS.prototype.onNavigate = function (event)
{
    if (event.isLong ())
        return;

    println("onNavigate()");

    if (event.isDown ())
    {
        this.clearPressedKeys ();
        this.clearNoteMapping ();
        //this.surface.pads.turnOff ();
        this.surface.setActiveMode (Maschine.MODE_NAVIGATE);
        if (this.model.hasSelectedDevice ())
        {
            var selectedDevice = this.model.getSelectedDevice();
            var cursorDevice = this.model.getCursorDevice();
            var names = cursorDevice.parameterPageNames;

        }
    }
    else
    {
        this.updateNoteMapping ();
        this.surface.setActiveMode (Maschine.MODE_BANK_DEVICE);
    }
};

PlayViewMS.prototype.onOctaveDown = function (event)
{
    if (!event.isDown ())
        return;
    this.clearPressedKeys ();
    this.scales.decOctave ();
    this.updateNoteMapping ();
    this.surface.getDisplay ().showNotification ('       ' + this.scales.getRangeText ());
};

PlayViewMS.prototype.onOctaveUp = function (event)
{
    if (!event.isDown ())
        return;
    this.clearPressedKeys ();
    this.scales.incOctave ();
    this.updateNoteMapping ();
    this.surface.getDisplay ().showNotification ('       ' + this.scales.getRangeText ());
};

PlayViewMS.prototype.onLeftArrow = function (event)
{
    if (this.surface.isPressed(MaschineButton.PAD_MODE))
    {
        this.surface.setButtonConsumed(MaschineButton.PAD_MODE);
        this.onOctaveDown(event);
        return;
    }
    if (!event.isDown())
        return;
    this.scrollLeft (event);
};

PlayViewMS.prototype.onRightArrow = function (event)
{
    if (this.surface.isPressed(MaschineButton.PAD_MODE))
    {
        this.surface.setButtonConsumed(MaschineButton.PAD_MODE);
        this.onOctaveUp(event);
        return;
    }
    if (!event.isDown())
        return;
    this.scrollRight (event);
};

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


AbstractView.prototype.scrollLeft = function (event)
{
    switch (this.surface.getCurrentMode ())
    {
//        case MODE_BANK_DEVICE:
//        case MODE_PRESET:
//            this.model.getCursorDevice ().selectPrevious ();
//            break;

        default:
            var tb = this.model.getCurrentTrackBank ();
            var sel = tb.getSelectedTrack ();
            var index = sel == null ? 0 : sel.index - 1;
            if (index == -1 || this.surface.isShiftPressed ())
            {
                if (!tb.canScrollTracksUp ())
                    return;
                tb.scrollTracksPageUp ();
                var newSel = index == -1 || sel == null ? 3 : sel.index;
                scheduleTask (doObject (this, this.selectTrack), [ newSel ], 75);
                return;
            }
            this.selectTrack (index);
            break;
    }
};

AbstractView.prototype.scrollRight = function (event)
{
    switch (this.surface.getCurrentMode ())
    {
//        case MODE_BANK_DEVICE:
//        case MODE_PRESET:
//            this.model.getCursorDevice ().selectNext ();
//            break;

        default:
            var tb = this.model.getCurrentTrackBank ();
            var sel = tb.getSelectedTrack ();
            var index = sel == null ? 0 : sel.index + 1;
            if (index == 4 || this.surface.isShiftPressed ())
            {
                if (!tb.canScrollTracksDown ())
                    return;
                tb.scrollTracksPageDown ();
                var newSel = index == 4 || sel == null ? 0 : sel.index;
                scheduleTask (doObject (this, this.selectTrack), [ newSel ], 75);
                return;
            }
            this.selectTrack (index);
            break;
    }
};


PlayViewMS.prototype.clearPressedKeys = function ()
{
    for (var i = 0; i < 128; i++)
        this.pressedKeys[i] = 0;
};

// PlayViewMS.prototype.onAccent = function (event)

PlayViewMS.prototype.initMaxVelocity = function ()
{
    this.maxVelocity = initArray (Config.fixedAccentValue, 128);
    this.maxVelocity[0] = 0;
    this.surface.setVelocityTranslationTable (Config.accentActive ? this.maxVelocity : this.defaultVelocity);
};