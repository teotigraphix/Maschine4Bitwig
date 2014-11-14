
DrumView.NUM_DISPLAY_COLS = 16;
DrumView.DRUM_START_KEY = 36;

Scales.DRUM_MATRIX =
    [
        0,   1,  2,  3,
        4,   5,  6,  7,
        8,   9, 10, 11,
        12, 13, 14, 15,
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

    this.model.getCursorDevice ().drumPadBank.getChannel (index).selectInEditor ();

//    // Delete all of the notes on that 'pad'
//    if (playedPad >= 0 && this.surface.isDeletePressed ())
//    {
//        this.surface.setButtonConsumed (MaschineButton.ERASE);
//        this.clip.clearRow (this.offsetY + this.selectedPad);
//    }
};

DrumView.prototype.drawGrid = function ()
{
    if (!this.canSelectedTrackHoldNotes())
    {
        this.surface.pads.turnOff();
        return;
    }

    var isRecording = this.model.hasRecordingState();

    var tb = this.model.getTrackBank ();
    var selectedTrack = tb.getSelectedTrack ();
    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 4; x++)
        {
            var index = 4 * y + x;
            var p = this.pads[index]; // mute, exists, solo

            var pad = this.model.getCursorDevice ().drumPadLayers[index];

            var padColorId = pad.color;
            var padColor = BitwigColor.getColor (padColorId);
            if (padColor == null)
                padColor = BitwigColor.getColor (selectedTrack.color);
            if (!pad.exists)
                padColor = COLOR.OFF;

            var c = this.pressedKeys[this.offsetY + index] > 0 ?
                (isRecording ? COLOR.RED : COLOR.GREEN) : (this.selectedPad == index ? COLOR.BLUE : (p.exists ?
                (p.mute ? COLOR.BLUE_DIM : (p.solo ? COLOR.YELLOW : Config.padTrackColor ? padColor
                    : COLOR.ON)) : COLOR.YELLOW_DIM));

            this.surface.pads.lightEx (x, 3 - y, c, null, false);
        }
    }
};

function dump(object) {
    for (var name in object) {
        println (name + " : " + object[name]);
    }
}

DrumView.prototype.updateNoteMapping = function ()
{
    this.noteMap = this.canSelectedTrackHoldNotes () && !this.surface.isSelectPressed () ?
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
        this.onOctaveUp (event);
    //this.model.getCursorDevice().drumPadBank.setChannelScrollStepSize (4);
    this.model.getCursorDevice().drumPadBank.scrollChannelsPageDown ();

};

DrumView.prototype.onDown = function (event)
{
    if (!event.isDown ())
        return;
    //if (!this.surface.isShiftPressed ())
    //    AbstractView.prototype.onDown.call (this, event);
    //else
        this.onOctaveDown (event);
    //this.model.getCursorDevice().drumPadBank.setChannelScrollStepSize (4);
    this.model.getCursorDevice().drumPadBank.scrollChannelsPageUp();
};