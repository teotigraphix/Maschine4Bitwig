// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function StepSequencerView (model)
{
    AbstractSequencerView.call (this, model, 128, DrumView.NUM_DISPLAY_COLS);
    this.offsetY = DrumView.DRUM_START_KEY;
    this.pads = initArray ({ exists: true, solo: false, mute: false }, 16);
    this.pressedKeys = initArray (0, 128);
}

StepSequencerView.prototype = new AbstractSequencerView ();

StepSequencerView.prototype.onActivate = function ()
{
    AbstractSequencerView.prototype.onActivate.call (this);
};

StepSequencerView.prototype.onGridNote = function (note, velocity)
{
    if (!this.canSelectedTrackHoldNotes ())
        return;

    var index = note - 36;
    var x = index % 4;
    var y = Math.floor (index / 4);

    if (velocity != 0)
    {
        var col = 4 * (3 - y) + x;
//        println("index, " + index);
//        println("col, " + col);
//        println("index, " + index);
        this.clip.toggleStep (col, this.offsetY + this.getSelectedPad (), Config.accentActive ? Config.fixedAccentValue : velocity);
    }
};

StepSequencerView.prototype.drawGrid = function ()
{
    if (!this.canSelectedTrackHoldNotes ())
    {
        this.surface.pads.turnOff ();
        return;
    }

    var isRecording = this.model.hasRecordingState ();

    // Clip length/loop area
//    var quartersPerPad = this.model.getQuartersPerMeasure ();
//    var maxQuarters = quartersPerPad * 16;
//    var start = this.clip.getLoopStart ();
//    var loopStartPad = Math.floor (Math.max (0, start) / quartersPerPad);
//    var loopEndPad   = Math.ceil (Math.min (maxQuarters, start + this.clip.getLoopLength ()) / quartersPerPad);
//    for (var pad = 0; pad < 16; pad++)
//        this.surface.pads.lightEx (4 + pad % 4, 4 + Math.floor (pad / 4), pad >= loopStartPad && pad < loopEndPad ? PUSH_COLOR2_WHITE : PUSH_COLOR_BLACK, null, false);

    // Paint the sequencer steps
    var step = this.clip.getCurrentStep ();
    var hiStep = this.isInXRange (step) ? step % DrumView.NUM_DISPLAY_COLS : -1;
    for (var col = 0; col < DrumView.NUM_DISPLAY_COLS; col++)
    {
        //println("drawc, " + col);
        var isSet = this.clip.getStep (col, this.offsetY + this.getSelectedPad ());
        var hilite = col == hiStep;
        var x = col % 4;
        var y = 3 - Math.floor (col / 4);
        this.surface.pads.lightEx (x, 3 - y, isSet ? (hilite ? COLOR.GREEN : COLOR.BLUE) : hilite ? COLOR.GREEN : COLOR.OFF, null, false);
    }
};

StepSequencerView.prototype.getSelectedPad = function ()
{
    return this.surface.getView (Maschine.VIEW_DRUM).selectedPad;
};
