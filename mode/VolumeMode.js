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
        d.setCell (0, i, t.exists ? "Volume" : "", Display.FORMAT_RAW)
         .setCell (1, i, t.volumeStr, Display.FORMAT_RAW);
         //.setCell (2, i, t.exists ? (this.surface.showVU ? t.vu : t.volume) : "", t.exists ? Display.FORMAT_VALUE : Display.FORMAT_RAW);
    }
    d.done (0).done (1);

    //this.drawRow4 ();
};
