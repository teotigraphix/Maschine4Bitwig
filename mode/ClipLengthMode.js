// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function ClipLengthMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_CLIP_LENGTH;
    this.isTemporary = false;
}

ClipLengthMode.prototype = new BaseMode ();

ClipLengthMode.prototype.onFirstRow = function (index)
{
    Config.setNewClipLengthIndex (index);
};

ClipLengthMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    d.clear ().setBlock (0, 0, "New Clip  ").setBlock (0, 1, "Length:");
    for (var i = 0; i < 8; i++)
        d.setCell (1, i, (Config.newClipLengthIndex == i ? ">" : "") + Config.CLIP_LENGTHS[i]);
    d.allDone ();
};

ClipLengthMode.prototype.updateFirstRow = function ()
{
    for (var i = 0; i < 8; i++)
        this.surface.lightButton (MaschineButton.TOP_ROW_0 + i,  Config.newClipLengthIndex == i);
};
