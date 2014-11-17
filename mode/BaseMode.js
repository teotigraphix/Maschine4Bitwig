// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function BaseMode (model)
{
    AbstractMode.call (this, model);

    this.isTemporary = false;
}
BaseMode.prototype = new AbstractMode ();

BaseMode.prototype.clearTopRow = function ()
{
    for (var i = MaschineButton.TOP_ROW_0; i <= MaschineButton.TOP_ROW_7; i++)
        this.surface.lightButton (i, false);
};
