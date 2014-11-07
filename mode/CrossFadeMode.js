// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function CrossFadeMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_XFADE;
}
CrossFadeMode.prototype = new BaseMode ();

CrossFadeMode.prototype.onValueKnob = function (index, value)
{
    var tb = this.model.getCurrentTrackBank ();
    tb.setCrossfadeModeAsNumber (index, changeValue (value, tb.getCrossfadeModeAsNumber (index), 1, 2));
};

CrossFadeMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    var tb = this.model.getCurrentTrackBank ();

    for (var i = 0; i < 8; i++)
    {
        var t = tb.getTrack (i);
        // TODO Config for Track name vrs Mode name
        var n = (true) ? optimizeName (t.name, t.selected ? 5 : 6) : "XFade";
        if (t.selected)
            n = ">" + n;
        d.setCell (0, i, t.exists ? n : "", Display.FORMAT_RAW)
         .setCell (1, i, t.exists ? (t.crossfadeMode == 'A' ? 'A' : (t.crossfadeMode == 'B' ? '     B' : '  <> ')) : "", Display.FORMAT_RAW);
    }
    d.done (0).done (1);
};
