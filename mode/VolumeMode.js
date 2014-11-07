// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function VolumeMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_VOLUME;
}
VolumeMode.prototype = new BaseMode ();

VolumeMode.prototype.onValueKnob = function (index, value)
{
    this.model.getCurrentTrackBank ().changeVolume (index, value, this.surface.getFractionValue ());
};

VolumeMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    d.clear ();
    var tb = this.model.getCurrentTrackBank ();

    for (var i = 0; i < 8; i++)
    {
        var t = tb.getTrack (i);
        // TODO Config for Track name vrs Mode name
        var n = (true) ? optimizeName (t.name, t.selected ? 5 : 6) : "Volume";
        if (t.selected)
            n = ">" + n;
        d.setCell (0, i, t.exists ? n : "", Display.FORMAT_RAW)
         .setCell (1, i, t.volumeStr, Display.FORMAT_RAW);
    }
    d.done (0).done (1);
};
