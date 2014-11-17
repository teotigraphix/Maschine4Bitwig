
DrumView.NUM_DISPLAY_COLS = 16;
DrumView.DRUM_START_KEY = 36;

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
    this.canScrollUp = false;
    this.canScrollDown = false;

    // TODO: Read the information in Bitwig 1.1
    this.pads = initArray ({ exists: true, solo: false, mute: false }, 16);
    this.selectedPad = 0;
    this.pressedKeys = initArray (0, 128);
    this.noteMap = this.scales.getEmptyMatrix ();

    var tb = model.getTrackBank ();
    tb.addNoteListener (doObject (this, function (pressed, note, velocity)
    {
        // Light notes send from the sequencer
        this.pressedKeys[note] = pressed ? velocity : 0;
    }));
    tb.addTrackSelectionListener (doObject (this, function (index, isSelected)
    {
        this.clearPressedKeys ();
    }));
}
DrumView.prototype = new AbstractSequencerView ();

DrumView.prototype.onActivate = function ()
{
    AbstractSequencerView.prototype.onActivate.call (this);

    this.model.getCursorDevice ().drumPadBank.setIndication (true);
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
    return d.mue;
};

DrumView.prototype.isSolo = function (index)
{
    var d = this.model.getCursorDevice ().drumPadLayers[index];
    return d.solo;
};

DrumView.prototype.toggleMute = function (index)
{
    var d = this.model.getCursorDevice ().drumPadLayers[index];
    this.model.getCursorDevice ().drumPadBank.getChannel (index).getMute().set(!d.mute);
};

DrumView.prototype.toggleSolo = function (index)
{
    var d = this.model.getCursorDevice ().drumPadLayers[index];
    this.model.getCursorDevice ().drumPadBank.getChannel (index).getSolo().set(!d.solo);
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

    var padColor = this.getSelectPadColor (pad, selectedTrack, true);
    if (!pad.exists)
        padColor = COLOR.OFF;

    var recording = isRecording ? COLOR.RED : this.getSelectPadColor (pad, selectedTrack, true);
    var padColorOn = Config.padTrackColor ? padColor : COLOR.ON;
    var padColorSolo = pad.solo ? padColorOn : padColorOn;
    var padColorMute = pad.mute ? padColorOn : padColorSolo;

    var color = this.pressedKeys[this.offsetY + index] > 0 ?
        recording : (this.selectedPad == index ? this.getSelectPadColor (pad, selectedTrack) : (pad.exists ?
        padColorMute : COLOR.OFF));

    if (this.pressedKeys[this.offsetY + index] > 0)
        return this.getSelectPadColor (pad, selectedTrack);

    return color;
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
    if (this.surface.isPressed (MaschineButton.SOLO))
        isDim = !pad.solo;

    var padColorId = pad.color;
    var padColor = BitwigColor.getColor (padColorId, isDim);
    if (padColor == null)
        padColor = BitwigColor.getColor (selectedTrack.color, isDim);

    return padColor;
};

DrumView.prototype.updateNoteMapping = function ()
{
    var isPressed = this.surface.isSelectPressed () ||
        this.surface.isPressed (MaschineButton.MUTE) ||
        this.surface.isPressed (MaschineButton.SOLO);
    this.noteMap = this.canSelectedTrackHoldNotes () && !isPressed ?
        this.scales.getDrumMatrix () : this.scales.getEmptyMatrix ();
    this.surface.setKeyTranslationTable (this.noteMap);
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

DrumView.prototype.onUp = function (event)
{
    if (!event.isDown ())
        return;
    //if (!this.surface.isShiftPressed ())
    //    AbstractView.prototype.onUp.call (this, event);
    //else
    //    this.onOctaveUp (event);
    //this.model.getCursorDevice().drumPadBank.setChannelScrollStepSize (4);
    //this.model.getCursorDevice().drumPadBank.scrollChannelsPageDown ();

};

DrumView.prototype.onDown = function (event)
{
    if (!event.isDown ())
        return;
    //if (!this.surface.isShiftPressed ())
    //    AbstractView.prototype.onDown.call (this, event);
    //else
     //   this.onOctaveDown (event);
    //this.model.getCursorDevice().drumPadBank.setChannelScrollStepSize (4);
    //this.model.getCursorDevice().drumPadBank.scrollChannelsPageUp();
};