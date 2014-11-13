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

    var len = this.clip.getLoopLength();
//    println("len, " + len);
//    if (len == 0 )
//        this.onNew();

    if (velocity != 0)
    {
        var col = 4 * y + x;
//        println("index, " + index);
//        println("col, " + col);
//        println("this.offsetY, " + this.offsetY);
//        println("this.getSelectedPad ()), " + (this.getSelectedPad ()));
        this.clip.toggleStep (col, this.offsetY + this.getSelectedPad (), Config.accentActive ? Config.fixedAccentValue : velocity);
    }
};

StepSequencerView.prototype.onNew = function ()
{

    var tb = this.getCurrentTrackBank ();
    var t = tb.getSelectedTrack ();
    if (t != null)
    {
        var slotIndexes = tb.getSelectedSlots (t.index);
        var slotIndex = slotIndexes.length == 0 ? 0 : slotIndexes[0].index;
        for (var i = 0; i < 4; i++)
        {
            var sIndex = (slotIndex + i) % 4;
            var s = t.slots[sIndex];
            if (!s.hasContent)
            {
                var slots = tb.getClipLauncherSlots (t.index);
                slots.createEmptyClip (sIndex, Math.pow (2, tb.getNewClipLength ()));
                if (slotIndex != sIndex)
                    slots.select (sIndex);
                slots.launch (sIndex);
                this.model.getTransport ().setLauncherOverdub (true);
                return;
            }
        }
    }
    displayNotification ("In the current selected grid view there is no empty slot. Please scroll down.");
};

StepSequencerView.prototype.drawGrid = function ()
{
    if (!this.canSelectedTrackHoldNotes ())
    {
        this.surface.pads.turnOff ();
        return;
    }

    var isRecording = this.model.hasRecordingState ();

    var tb = this.model.getTrackBank ();
    var selectedTrack = tb.getSelectedTrack ();
    var padColor = BitwigColor.getColor (selectedTrack.color);

    // Paint the sequencer steps
    var step = this.clip.getCurrentStep ();
    var hiStep = this.isInXRange (step) ? step % DrumView.NUM_DISPLAY_COLS : -1;
    for (var col = 0; col < DrumView.NUM_DISPLAY_COLS; col++)
    {
        var isSet = this.clip.getStep (col, this.offsetY + this.getSelectedPad ());
        var hilite = col == hiStep;
        var x = col % 4;
        var y = Math.floor (col / 4);
        this.surface.pads.lightEx (x, 3 - y, isSet ? (hilite ? COLOR.GREEN : padColor) : hilite ? COLOR.GREEN : COLOR.OFF, null, false);
    }
};

StepSequencerView.prototype.getSelectedPad = function ()
{
    return this.surface.getView (Maschine.VIEW_DRUM).selectedPad;
};
