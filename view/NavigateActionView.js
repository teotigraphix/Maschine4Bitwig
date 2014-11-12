// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function NavigateActionView (model)
{
    BaseMaschineView.call (this, model);

    this.pressedKey = -1;
    this.selectedMode = null;

    this.indexTranslation = [
        36, 37, 38, 39,
        40, 41, 42, 43,
        44, 45, 46, 47,
        48, 49, 50, 51
    ];
}

NavigateActionView.prototype = new BaseMaschineView ();

NavigateActionView.prototype.attachTo = function (surface)
{
    AbstractView.prototype.attachTo.call (this, surface);
};

NavigateActionView.prototype.drawGrid = function ()
{
    for (var i = 36; i < 52; i++)
    {
        // TODO refactor
        this.surface.pads.light (i, (i == this.pressedKey) ? COLOR.ON : COLOR.ON_DIM);
        var index = this.indexTranslation.indexOf (i);

    }
};

NavigateActionView.prototype.onGridNote = function (note, velocity)
{
    var index = this.indexTranslation.indexOf (note);
    this.pressedKey = -1;
    if (velocity > 0)
    {
        this.pressedKey = note;
        this.doNavigateAction (index);
    }
    else
    {
        this.pressedKey = -1;
    }
};
