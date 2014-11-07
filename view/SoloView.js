// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function SoloView (model)
{
    BaseMaschineView.call (this, model);

    this.pressedKey = -1;

    this.indexTranslation = [
        40, 41, 42, 43,
        36, 37, 38, 39
    ];
}

SoloView.prototype = new BaseMaschineView ();

SoloView.prototype.attachTo = function (surface)
{
    AbstractView.prototype.attachTo.call (this, surface);
};

SoloView.prototype.drawGrid = function ()
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
                    this.surface.pads.light (i, COLOR.RED);
                }
                else
                    this.surface.pads.light (i, t.solo ? COLOR.RED_MEDIUM : COLOR.ON_DIM);
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

SoloView.prototype.onGridNote = function (note, velocity)
{
    this.pressedKey = -1;
    if (velocity > 0)
    {
        this.pressedKey = note;
        var tb = this.model.getCurrentTrackBank ();
        var index = this.indexTranslation.indexOf (note);
        var t = tb.getTrack (index);
        if (t != null)
            tb.toggleSolo (index);
    }
    else
    {

    }
};