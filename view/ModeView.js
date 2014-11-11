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
        if (index == 0)
        {
            if (this.surface.getPreviousModeId () == Maschine.getDefaultModeBankId ())
                this.surface.pads.light (i,  COLOR.OCEAN);
            else
                this.surface.pads.light (i,  COLOR.ON_DIM);
        }
        else if (mode != null && mode[0] == this.surface.getPreviousModeId ())
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
    var index = this.indexTranslation.indexOf (note);
    this.pressedKey = -1;
    if (velocity > 0)
    {
        this.pressedKey = note;
        this.selectedMode = Maschine.MODES[index];
    }
    else
    {
        if (this.selectedMode != null)
        {
            // will select the mode when the Select button is released
            if (index == 0)
                this.surface.setPreviousModeId (Maschine.getDefaultModeBankId ());
            else
                this.surface.setPreviousModeId (this.selectedMode[0]);
        }
    }
};
