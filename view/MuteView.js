// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function MuteView (model)
{
    BaseMaschineView.call (this, model);

    this.pressedKey = -1;
    this.selectedMode = null;

    this.indexTranslation = [
        40, 41, 42, 43,
        36, 37, 38, 39
    ];
}

MuteView.prototype = new BaseMaschineView ();

MuteView.prototype.attachTo = function (surface)
{
    AbstractView.prototype.attachTo.call (this, surface);
};

MuteView.prototype.drawGrid = function ()
{
    for (var i = 36; i < 52; i++)
    {
        if (i < 44)
        {
            var index = this.indexTranslation.indexOf (i);
            var tb = this.model.getCurrentTrackBank ();
            var t = tb.getTrack (index);
            if (t != null && t.exists)
            {
                if (i == this.pressedKey)
                {
                    this.surface.pads.light (i, COLOR.GREEN);
                }
                else
                    this.surface.pads.light (i, t.mute ? COLOR.ON_DIM : COLOR.GREEN_MEDIUM);
            }
            else
            {
                this.surface.pads.light (i, COLOR.OFF);
            }
        }
        else
        {
            this.surface.pads.light (i, COLOR.OFF);
        }
    }
};

MuteView.prototype.onGridNote = function (note, velocity)
{
    this.pressedKey = -1;
    if (velocity > 0)
    {
        this.pressedKey = note;
        var tb = this.model.getCurrentTrackBank ();
        var index = this.indexTranslation.indexOf (note);
        var t = tb.getTrack (index);
        if (t != null)
            tb.toggleMute (index);
    }
    else
    {

    }
};