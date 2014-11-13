// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

VolumeMode.TOP_ROW_MUTE_MODE = 0;
VolumeMode.TOP_ROW_SOLO_MODE = 1;

function VolumeMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_VOLUME;
    this.topRowMode = VolumeMode.TOP_ROW_MUTE_MODE;
}
VolumeMode.prototype = new BaseMode ();

VolumeMode.prototype.onFirstRow = function (index)
{
    if (this.surface.isSelectPressed ())
    {
        var tb = this.model.getCurrentTrackBank ();
        var t = tb.getTrack (index);
        if (t != null && t.exists)
            tb.select (index);
    }
    else
    {
        switch (this.topRowMode)
        {
            case VolumeMode.TOP_ROW_MUTE_MODE:
                this.toggleMute (index);
                break;
            case VolumeMode.TOP_ROW_SOLO_MODE:
                this.toggleSolo (index);
                break;
        }
    }
};

VolumeMode.prototype.onValueKnob = function (index, value)
{
    this.model.getCurrentTrackBank ().changeVolume (index, value, this.surface.getFractionValue ());
};

VolumeMode.prototype.updateFirstRow = function ()
{
    var tb = this.model.getCurrentTrackBank ();
    for (var i = 0; i < 8; i++)
    {
        var t = tb.getTrack (i);
        if (t != null)
        {
            if (t.exists)
            {
                switch (this.topRowMode)
                {
                    case VolumeMode.TOP_ROW_MUTE_MODE:
                        this.surface.lightButton (MaschineButton.TOP_ROW_0 + i, !t.mute);
                        break;
                    case VolumeMode.TOP_ROW_SOLO_MODE:
                        this.surface.lightButton (MaschineButton.TOP_ROW_0 + i, t.solo);
                        break;
                }
            }
            else
            {
                this.surface.lightButton (MaschineButton.TOP_ROW_0 + i, false);
            }
        }
    }
};

VolumeMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    d.clear ();
    var tb = this.model.getCurrentTrackBank ();

    for (var i = 0; i < 8; i++)
    {
        var t = tb.getTrack (i);

        var n = (true) ? optimizeName (t.name, t.selected ? 5 : 6) : "Volume";
        if (t.selected)
            n = ">" + n;
        d.setCell (0, i, t.exists ? n : "")
         .setCell (1, i, t.volumeStr);
    }
    d.done (0).done (1);
};

VolumeMode.prototype.toggleSolo = function (index)
{
    var tb = this.model.getCurrentTrackBank ();
    var t = tb.getTrack (index);
    if (t != null)
        tb.toggleSolo (index);
};

VolumeMode.prototype.toggleMute = function (index)
{
    var tb = this.model.getCurrentTrackBank ();
    var t = tb.getTrack (index);
    if (t != null)
        tb.toggleMute (index);
};