// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function PlayView (model)
{
    BaseMaschineView.call (this, model);
}

PlayView.prototype = new BaseMaschineView ();

PlayView.prototype.attachTo = function (surface)
{
    AbstractView.prototype.attachTo.call (this, surface);

    this.scales = this.model.getScales ();
    this.noteMap = this.scales.getEmptyMatrix ();
    this.pressedKeys = initArray (0, 128);
    this.defaultVelocity = [];
    for (var i = 0; i < 128; i++)
        this.defaultVelocity.push (i);
};

PlayView.prototype.updateNoteMapping = function ()
{
    var t = this.model.getTrackBank ().getSelectedTrack ();
    this.noteMap = t != null && t.canHoldNotes ? this.scales.getNoteMatrix () : this.scales.getEmptyMatrix ();
    // Workaround
    scheduleTask (doObject (this, function () { this.surface.setKeyTranslationTable (this.noteMap); }), null, 100);
};

PlayView.prototype.clearNoteMapping = function ()
{
    this.noteMap = this.scales.getEmptyMatrix ();
    // Workaround
    scheduleTask (doObject (this, function () { this.surface.setKeyTranslationTable (this.noteMap); }), null, 100);
};

PlayView.prototype.onActivate = function ()
{
    AbstractView.prototype.onActivate.call (this);
    this.surface.setButton (MaschineButton.PAD_MODE, MaschineButton.STATE_DOWN);
    this.surface.setButton (MaschineButton.STEP_MODE, MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.SCENE, MaschineButton.STATE_UP);
    this.model.getTrackBank ().setIndication (false);
    this.updateSceneButtons ();
    this.initMaxVelocity ();
};

PlayView.prototype.onUp = function (event)
{
    if (!this.surface.isShiftPressed ())
        AbstractView.prototype.onUp.call (this, event);
    else
        this.onOctaveUp (event);
};

PlayView.prototype.onDown = function (event)
{
    if (!this.surface.isShiftPressed ())
        AbstractView.prototype.onDown.call (this, event);
    else
        this.onOctaveDown (event);
};

PlayView.prototype.updateSceneButtons = function (buttonID)
{
    //for (var i = 0; i < 8; i++)
    //    this.push.setButton (PUSH_BUTTON_SCENE1 + i, PUSH_COLOR_BLACK);
};

PlayView.prototype.usesButton = function (buttonID)
{
    return true;
};

PlayView.prototype.drawGrid = function ()
{
    if (this.surface.isActiveMode(Maschine.MODE_NAVIGATE))
    {
        scheduleTask (doObject (this, function () {
            var cursorDevice = this.model.getCursorDevice();
            var names = cursorDevice.parameterPageNames;
            if (names != null)
            {
                for (var i = 36; i < 52; i++)
                {
                    if (i < 36 + names.length)
                        this.surface.pads.light (i, COLOR.PLAY);
                    else
                        this.surface.pads.light (i, COLOR.OFF);
                }
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

PlayView.prototype.onGridNote = function (note, velocity)
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


//PlayView.prototype.onNavigate = function (event)
//{
//    if (event.isLong ())
//        return;
//
//    println("onNavigate()");
//
//    if (event.isDown ())
//    {
//        this.clearPressedKeys ();
//        this.clearNoteMapping ();
//        //this.surface.pads.turnOff ();
//        this.surface.setPendingMode (Maschine.MODE_NAVIGATE);
//        if (this.model.hasSelectedDevice ())
//        {
//            var selectedDevice = this.model.getSelectedDevice();
//            var cursorDevice = this.model.getCursorDevice();
//            var names = cursorDevice.parameterPageNames;
//
//        }
//    }
//    else
//    {
//        //this.updateNoteMapping ();
//        //this.surface.setActiveMode (Maschine.MODE_BANK_DEVICE);
//    }
//};

PlayView.prototype.onOctaveDown = function (event)
{
    if (!event.isDown ())
        return;
    this.clearPressedKeys ();
    this.scales.decOctave ();
    this.updateNoteMapping ();
    this.surface.getDisplay ().showNotification ('                         Octave Range - ' + this.scales.getRangeText ());
};

PlayView.prototype.onOctaveUp = function (event)
{
    if (!event.isDown ())
        return;
    this.clearPressedKeys ();
    this.scales.incOctave ();
    this.updateNoteMapping ();
    this.surface.getDisplay ().showNotification ('                         Octave Range - ' + this.scales.getRangeText ());
};

PlayView.prototype.onLeftArrow = function (event)
{
    AbstractView.prototype.onLeftArrow.call (this, event);
};

PlayView.prototype.onRightArrow = function (event)
{
    AbstractView.prototype.onRightArrow.call (this, event);
};

PlayView.prototype.scrollUp = function (event)
{
    if (this.surface.isShiftPressed ())
        this.model.getApplication ().arrowKeyLeft ();
    else
        this.model.getApplication ().arrowKeyUp ();
};

PlayView.prototype.scrollDown = function (event)
{
    if (this.surface.isShiftPressed ())
        this.model.getApplication ().arrowKeyRight ();
    else
        this.model.getApplication ().arrowKeyDown ();
};


// PlayViewMS.prototype.onAccent = function (event)

PlayView.prototype.initMaxVelocity = function ()
{
    this.maxVelocity = initArray (Config.fixedAccentValue, 128);
    this.maxVelocity[0] = 0;
    this.surface.setVelocityTranslationTable (Config.accentActive ? this.maxVelocity : this.defaultVelocity);
};