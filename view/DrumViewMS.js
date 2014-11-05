
DrumView.NUM_DISPLAY_COLS = 32;
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

DrumView.prototype.onGridNote = function (note, velocity) {
    if (!this.canSelectedTrackHoldNotes())
        return;
    println("DrumView.onGridNote() " + note);

    var index = note - 36;
    var x = index % 4;
    var y = Math.floor (index / 4);

    if (x < 4)
    {
        // 4x4 Drum Pad Grid

        this.selectedPad = 4 * y + x;   // 0-16
        var playedPad = velocity == 0 ? -1 : this.selectedPad;

        // Mark selected note
        this.pressedKeys[this.offsetY + this.selectedPad] = velocity;

        // Delete all of the notes on that 'pad'
//        if (playedPad >= 0 && this.surface.isDeletePressed ())
//        {
//            this.surface.setButtonConsumed (PUSH_BUTTON_DELETE);
//            this.clip.clearRow (this.offsetY + this.selectedPad);
//        }
        return;
    }
};

DrumView.prototype.drawGrid = function ()
{
    if (!this.canSelectedTrackHoldNotes())
    {
        this.surface.pads.turnOff();
        return;
    }

    var isRecording = this.model.hasRecordingState();

    // 4x4 Drum Pad Grid
    for (var y = 0; y < 4; y++)
    {
        //println("f");
        for (var x = 0; x < 4; x++)
        {
            var index = 4 * y + x;
            var p = this.pads[index];
            var c = this.pressedKeys[this.offsetY + index] > 0 ?
                (isRecording ? COLOR.ARM : COLOR.PLAY) : (this.selectedPad == index ? COLOR.ODD_CURSOR_DRUM_PAD : (p.exists ?
                (p.mute ? COLOR.EVEN_CURSOR_DRUM_PAD : (p.solo ? COLOR.ODD_CURSOR_DRUM_PAD : COLOR.DRUM_PAD_NOTE_ON)) : COLOR.ODD_CURSOR_DRUM_PAD));
            this.surface.pads.lightEx(x, 7 - y, c, null, false);
        }
    }

};

DrumView.prototype.onActivate = function ()
{
    AbstractSequencerView.prototype.onActivate.call(this);
    this.surface.setButton (MaschineButton.PATTERN, 127);
};

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
