// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function ClipMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_CLIP;
}
ClipMode.prototype = new BaseMode ();

ClipMode.prototype.onValueKnob = function (index, value)
{
    var clip = this.surface.getView (Maschine.VIEW_DRUM).clip;
    var fractionValue = this.surface.isShiftPressed () ? 0.25 : 1;
    switch (index)
    {
        case 0:
            clip.changePlayStart (value, fractionValue);
            break;
        case 1:
            clip.changePlayEnd (value, fractionValue);
            break;
        case 2:
            clip.changeLoopStart (value, fractionValue);
            break;
        case 3:
            clip.changeLoopLength (value, fractionValue);
            break;
        case 4:
            clip.setLoopEnabled (value <= 61);
            break;
        case 6:
            clip.setShuffleEnabled (value <= 61);
            break;
        case 7:
            clip.changeAccent (value, fractionValue);
            break;
    }
};

ClipMode.prototype.updateDisplay = function ()
{
    var clip = this.surface.getView (Maschine.VIEW_DRUM).clip;
    var d = this.surface.getDisplay ();
    
    d.setCell (0, 0, "PlayStrt", Display.FORMAT_RAW)
     .setCell (1, 0, this.formatMeasures (clip.getPlayStart ()), Display.FORMAT_RAW)
     
     .setCell (0, 1, "Play End", Display.FORMAT_RAW)
     .setCell (1, 1, this.formatMeasures (clip.getPlayEnd ()), Display.FORMAT_RAW)
     
     .setCell (0, 2, "LoopStrt", Display.FORMAT_RAW)
     .setCell (1, 2, this.formatMeasures (clip.getLoopStart ()), Display.FORMAT_RAW)

     .setCell (0, 3, "LopLngth", Display.FORMAT_RAW)
     .setCell (1, 3, this.formatMeasures (clip.getLoopLength ()), Display.FORMAT_RAW)

     .setCell (0, 4, "Loop", Display.FORMAT_RAW)
     .setCell (1, 4, clip.isLoopEnabled () ? "On" : "Off", Display.FORMAT_RAW)
     
     .clearCell (0, 5)
     .clearCell (1, 5)

     .setCell (0, 6, "Shuffle", Display.FORMAT_RAW)
     .setCell (1, 6, clip.isShuffleEnabled () ? "On" : "Off", Display.FORMAT_RAW)
     
     .setCell (0, 7, "Accent", Display.FORMAT_RAW)
     .setCell (1, 7, clip.getAccent (), Display.FORMAT_RAW)
     
     .done (0).done (1);
};

ClipMode.prototype.formatMeasures = function (time)
{
    var quartersPerMeasure = this.model.getQuartersPerMeasure ();
    var measure = Math.floor (time / quartersPerMeasure);
    time = time - measure * quartersPerMeasure;
    var quarters = Math.floor (time);   // :1
    time = time - quarters; // *1
    var eights = Math.floor (time / 0.25);
    return measure + "." + quarters + "." + eights;
};