
DrumView.NUM_DISPLAY_COLS = 16;
DrumView.DRUM_START_KEY = 52;

Scales.DRUM_MATRIX =
    [
        0,   1,  2,  3,
        4,   5,  6,  7,
        8,   9, 10, 11,
        12, 13, 14, 15
    ];

function DrumView (model)
{
    AbstractSequencerView.call (this, model, 128, DrumView.NUM_DISPLAY_COLS);
    this.offsetY = DrumView.DRUM_START_KEY;
    this.canScrollUp = true;
    this.canScrollDown = true;

    this.offsetRow = 0;

    // TODO: Read the information in Bitwig 1.1
    this.pads = initArray ({ exists: true, solo: false, mute: false }, 16);
    this.selectedPad = 0;
    this.pressedKeys = initArray (0, 128);
    this.noteMap = this.scales.getEmptyMatrix ();

    var tb = model.getTrackBank ();
    tb.addNoteListener (doObject (this, function (pressed, note, velocity)
    {
        this.pressedKeys[note + 16] = pressed ? velocity : 0;
    }));
    tb.addTrackSelectionListener (doObject (this, function (index, isSelected)
    {
        this.clearPressedKeys ();
        scheduleTask (doObject (this, function ()
        {
            this.updateSelectedPad ();
        }), [], 30);
    }));
}
DrumView.prototype = new AbstractSequencerView ();

DrumView.prototype.onActivate = function ()
{
    AbstractSequencerView.prototype.onActivate.call (this);
    this.updateSelectedPad ();
};

DrumView.prototype.updateSelectedPad = function ()
{
    this.selectedPad = this.getSelectedDrumChannel ();
};

DrumView.prototype.getSelectedDrumChannel = function ()
{
    var channels = this.model.getCursorDevice ().drumPadLayers;
    for (var i = 0; i < channels.length; i++)
        if (channels[i].selected)
            return i;
    return -1;
};

DrumView.prototype.onGridNote = function (note, velocity) {
    if (!this.canSelectedTrackHoldNotes ())
        return;

    var index = note - 36;
    var x = index % 4;
    // y is bottom
    var y = Math.floor (index / 4);

    this.selectedPad = 4 * y + x;   // 0-15
    var playedPad = velocity == 0 ? -1 : this.selectedPad;

    // Mark selected note
    this.pressedKeys[this.offsetY + this.selectedPad] = velocity;

    if (velocity > 0)
    {
        this.model.getCursorDevice ().drumPadBank.getChannel (index).selectInEditor ();
        if (this.surface.isPressed (MaschineButton.MUTE))
            this.toggleMute (index);
        else if  (this.surface.isPressed (MaschineButton.SOLO))
            this.toggleSolo (index);
    }


//    // Delete all of the notes on that 'pad'
//    if (playedPad >= 0 && this.surface.isDeletePressed ())
//    {
//        this.surface.setButtonConsumed (MaschineButton.ERASE);
//        this.clip.clearRow (this.offsetY + this.selectedPad);
//    }
};

DrumView.prototype.isMute = function (index)
{
    var d = this.model.getCursorDevice ().drumPadLayers[index];
    return d.mute;
};

DrumView.prototype.isSolo = function (index)
{
    var d = this.model.getCursorDevice ().drumPadLayers[index];
    return d.solo;
};

DrumView.prototype.toggleMute = function (index)
{
    var d = this.model.getCursorDevice ().drumPadLayers[index];
    this.model.getCursorDevice ().drumPadBank.getChannel (index).getMute ().set (!d.mute);
};

DrumView.prototype.toggleSolo = function (index)
{
    var d = this.model.getCursorDevice ().drumPadLayers[index];
    this.model.getCursorDevice ().drumPadBank.getChannel (index).getSolo ().set (!d.solo);
};

DrumView.prototype.drawGrid = function ()
{
    if (!this.canSelectedTrackHoldNotes ())
    {
        this.surface.pads.turnOff ();
        return;
    }

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 4; x++)
        {
            var index = 4 * y + x;
            this.surface.pads.lightEx (x, 3 - y, this.getPadColor (index), null, false);
        }
    }
};

DrumView.prototype.getPadColor = function (index)
{
    var tb = this.model.getTrackBank ();
    var selectedTrack = tb.getSelectedTrack ();
    var isRecording = this.model.hasRecordingState();
    var pad = this.model.getCursorDevice ().drumPadLayers[index];

    if (this.pressedKeys[this.offsetY + index] > 0 && !pad.mute && (this.isSoloState () && pad.solo))
        return COLOR.ON_MEDIUM;

    var padColor = this.getSelectPadColor (pad, selectedTrack, true);
    if (!pad.exists)
        padColor = COLOR.OFF;

    return padColor;
};

function dump(object) {
    for (var name in object) {
        println (name + " : " + object[name]);
    }
}

DrumView.prototype.getSelectPadColor = function (pad, selectedTrack, isDim)
{
    if (this.surface.isPressed (MaschineButton.MUTE))
        isDim = pad.mute;
    else if (this.surface.isPressed (MaschineButton.SOLO))
        isDim = !pad.solo;
    else if (pad.selected)
        isDim = false;

    if (!this.surface.isPressed (MaschineButton.MUTE) && pad.mute)
        return COLOR.OFF;
    if (this.isSoloState () && !this.surface.isPressed (MaschineButton.SOLO) && !pad.solo)
        return COLOR.OFF;

    var padColorId = pad.color;
    var padColor = BitwigColor.getColor (padColorId, isDim);
    if (padColor == null)
        padColor = BitwigColor.getColor (selectedTrack.color, isDim);

    return padColor;
};

DrumView.prototype.isSoloState = function ()
{
    var len = this.model.getCursorDevice ().drumPadLayers.length;
    for (var i = 0; i < len; i++)
        if (this.model.getCursorDevice ().drumPadLayers[i].solo)
            return true;
    return false;
};

DrumView.prototype.updateNoteMapping = function ()
{
    var isPressed = this.surface.isSelectPressed () ||
        this.surface.isPressed (MaschineButton.MUTE) ||
        this.surface.isPressed (MaschineButton.SOLO);
    this.noteMap = this.canSelectedTrackHoldNotes () && !isPressed ?
        this.getDrumMatrix () : this.scales.getEmptyMatrix ();
    this.surface.setKeyTranslationTable (this.noteMap);
};

DrumView.prototype.getDrumMatrix = function ()
{
    var matrix = Scales.DRUM_MATRIX;
    var noteMap = this.scales.getEmptyMatrix ();
    // start note 36, end note 100
    var startNote = Scales.DRUM_NOTE_START;
    for (var note = startNote; note < Scales.DRUM_NOTE_END; note++)
    {
        var n = matrix[note - Scales.DRUM_NOTE_START] == -1 ? -1 : matrix[note - startNote] +
            startNote + (this.scales.drumOctave * 16) + this.offsetRow;
        noteMap[note] = n < 0 || n > 127 ? -1 : n;
    }
    return noteMap;
};

DrumView.prototype.onOctaveDown = function (event)
{
    if (!event.isDown ())
        return;
    this.clearPressedKeys ();
    this.scales.decDrumOctave ();
    this.offsetY = DrumView.DRUM_START_KEY + this.scales.getDrumOctave () * 16;
    this.updateNoteMapping ();
    this.surface.getDisplay ().showNotification ('          ' + this.scales.getDrumRangeText ());
};

DrumView.prototype.onOctaveUp = function (event)
{
    if (!event.isDown ())
        return;
    this.clearPressedKeys ();
    this.scales.incDrumOctave ();
    this.offsetY = DrumView.DRUM_START_KEY + this.scales.getDrumOctave () * 16;
    this.updateNoteMapping ();
    this.surface.getDisplay ().showNotification ('          ' + this.scales.getDrumRangeText ());
};

DrumView.prototype.onRowDown = function (event)
{
    if (!event.isDown ())
        return;
    this.clearPressedKeys ();
    this.offsetRow -= 4;
    this.offsetY = DrumView.DRUM_START_KEY + (this.scales.getDrumOctave () * 16) + this.offsetRow;
    this.updateNoteMapping ();
    this.surface.getDisplay ().showNotification ('          ' + this.scales.getDrumRangeText ());
};

DrumView.prototype.onRowUp = function (event)
{
    if (!event.isDown ())
        return;
    this.clearPressedKeys ();
    this.offsetRow += 4;
    this.offsetY = DrumView.DRUM_START_KEY + (this.scales.getDrumOctave () * 16) + this.offsetRow;
    this.updateNoteMapping ();
    this.surface.getDisplay ().showNotification ('          ' + this.scales.getDrumRangeText ());
};

DrumView.prototype.onUp = function (event)
{
    if (!event.isDown ())
        return;

    if (this.surface.isShiftPressed ())
    {
        this.onRowUp(event);
        this.model.getCursorDevice().drumPadBank.scrollChannelsDown ();
        return;
    }

    this.onOctaveUp (event);

    this.model.getCursorDevice().drumPadBank.scrollChannelsPageDown ();
};

DrumView.prototype.onDown = function (event)
{
    if (!event.isDown ())
        return;

    if (this.surface.isShiftPressed ())
    {
        this.onRowDown(event);
        this.model.getCursorDevice().drumPadBank.scrollChannelsUp ();
        return;
    }

    this.onOctaveDown (event);
    //this.model.getCursorDevice().drumPadBank.setChannelScrollStepSize (4);
    this.model.getCursorDevice().drumPadBank.scrollChannelsPageUp ();
};

DrumView.prototype.scrollLeft = function (event)
{
    AbstractView.prototype.scrollLeft.call (this, event);
};

DrumView.prototype.scrollRight = function (event)
{
    AbstractView.prototype.scrollRight.call (this, event);
};