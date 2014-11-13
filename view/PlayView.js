// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function PlayView (model)
{
    BaseMaschineView.call (this, model);

    this.scales = this.model.getScales ();
    this.noteMap = this.scales.getEmptyMatrix ();
    this.pressedKeys = initArray (0, 128);
    this.defaultVelocity = [];
    for (var i = 0; i < 128; i++)
        this.defaultVelocity.push (i);

    Config.addPropertyListener (Config.ACTIVATE_FIXED_ACCENT, doObject (this, function ()
    {
        this.initMaxVelocity ();
    }));
    Config.addPropertyListener (Config.FIXED_ACCENT_VALUE, doObject (this, function ()
    {
        this.initMaxVelocity ();
    }));

    var tb = model.getTrackBank ();
    tb.addNoteListener (doObject (this, function (pressed, note, velocity)
    {
        // Light notes send from the sequencer
        for (var i = 0; i < 128; i++)
        {
            if (this.noteMap[i] == note)
                this.pressedKeys[i] = pressed ? velocity : 0;
        }
    }));
    tb.addTrackSelectionListener (doObject (this, function (index, isSelected)
    {
        this.clearPressedKeys ();
    }));
}

PlayView.prototype = new BaseMaschineView ();

PlayView.prototype.attachTo = function (surface)
{
    AbstractView.prototype.attachTo.call (this, surface);


};

PlayView.prototype.updateNoteMapping = function ()
{
    this.noteMap = this.canSelectedTrackHoldNotes () ? this.scales.getNoteMatrix () : this.scales.getEmptyMatrix ();
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
    this.model.getTrackBank ().setIndication (false);
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

PlayView.prototype.usesButton = function (buttonID)
{
    return true;
};

PlayView.prototype.drawGrid = function ()
{
    var isKeyboardEnabled = this.canSelectedTrackHoldNotes ();
    var isRecording = this.model.hasRecordingState ();

    var tb = this.model.getTrackBank ();
    var selectedTrack = tb.getSelectedTrack ();
    for (var i = 36; i < 52; i++)
    {
        this.surface.pads.light (i, isKeyboardEnabled ? (this.pressedKeys[i] > 0 ?
            (isRecording ? COLOR.ARM : COLOR.PLAY) :
            this.getColor (this.noteMap, i, Config.padTrackColor ? BitwigColor.getColor (selectedTrack.color)
                : COLOR.ON, Config.padTrackColor ? COLOR.ON : COLOR.OCEAN)) : COLOR.OFF, null, false);
    }
};

PlayView.prototype.getColor = function (noteMap, note, trackColor, octaveColor)
{
    var midiNote = noteMap[note];
    if (midiNote == -1)
        return Scales.SCALE_COLOR_OFF;
    var n = (midiNote - Scales.OFFSETS[this.scales.scaleOffset]) % 12;
    if (n == 0)
        return octaveColor;
    if (this.scales.isChromatic ())
    {
        var notes = Scales.INTERVALS[this.scales.selectedScale].notes;
        for (var i = 0; i < notes.length; i++)
        {
            if (notes[i] == n)
                return trackColor;
        }
        return Scales.SCALE_COLOR_OUT_OF_SCALE;
    }
    return trackColor;
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

//    var index = note - 36;
//    this.surface.getView (Maschine.VIEW_DRUM).selectedPad = index;

    // Mark selected notes
    for (var i = 0; i < 128; i++)
    {
        if (this.noteMap[note] == this.noteMap[i])
        {
            this.pressedKeys[i] = velocity;
        }

    }
};

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