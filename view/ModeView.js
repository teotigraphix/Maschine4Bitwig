// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function ModeView (model)
{
    BaseMaschineView.call (this, model);

    this.pressedKey = -1;
    this.selectedMode = null;

    this.indexTranslation = [
        48, 49, 50, 51,
        44, 45, 46, 47,
        40, 41, 42, 43,
        36, 37, 38, 39
    ];
}

ModeView.prototype = new BaseMaschineView ();

ModeView.prototype.attachTo = function (surface)
{
    AbstractView.prototype.attachTo.call (this, surface);
};

ModeView.prototype.drawGrid = function ()
{
    for (var i = 36; i < 52; i++)
    {
        // TODO refactor
        this.surface.pads.light (i, (i == this.pressedKey) ? COLOR.ON : COLOR.ON_DIM);
        var index = this.indexTranslation.indexOf (i);
        var mode = Maschine.MODES[index];
        if (mode != null && mode[0] == this.surface._previousModeId)
        {
            this.surface.pads.light (i,  COLOR.OCEAN);
        }
        else if (mode == null )
        {
            this.surface.pads.light (i, COLOR.OFF);
        }
    }
};

ModeView.prototype.onGridNote = function (note, velocity)
{
    this.pressedKey = -1;
    if (velocity > 0)
    {
        this.pressedKey = note;
        this.selectedMode = Maschine.MODES[this.indexTranslation.indexOf (note)];
    }
    else
    {
        if (this.selectedMode != null)
        {
            // will select the mode when the Solo button is released
            this.surface._previousModeId = this.selectedMode[0]
        }
    }
};
