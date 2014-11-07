// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function PanMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_PAN;
}
PanMode.prototype = new BaseMode ();

PanMode.prototype.onValueKnob = function (index, value)
{
    this.model.getCurrentTrackBank ().changePan (index, value, this.surface.getFractionValue ());
};

//PanMode.prototype.onValueKnobTouch = function (index, isTouched)
//{
//    if (isTouched && this.surface.isDeletePressed ())
//        this.model.getCurrentTrackBank ().resetPan (index);
//};

PanMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    var tb = this.model.getCurrentTrackBank ();

    for (var i = 0; i < 8; i++)
    {
        var t = tb.getTrack (i);
        // TODO Config for Track name vrs Mode name
        var n = (true) ? optimizeName (t.name, t.selected ? 5 : 6) : "Pan";
        if (t.selected)
            n = ">" + n;
        d.setCell (0, i, t.exists ? n : "", Display.FORMAT_RAW)
         .setCell (1, i, t.panStr, Display.FORMAT_RAW);
    }
    d.done (0).done (1).done (2);
};
