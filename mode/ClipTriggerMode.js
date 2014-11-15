// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function ClipTriggerMode (model)
{
    BaseMode.call (this, model);
    this.isTemporary = true;
    this.id = Maschine.MODE_CLIP_TRIGGER;
}

ClipTriggerMode.prototype = new BaseMode ();


ClipTriggerMode.prototype.onFirstRow = function (index)
{
    var tb = this.surface.getActiveView ().getCurrentTrackBank ();
    if (index < 4)
        tb.toggleMute (index);
    else
        tb.toggleArm (index - 4);
};

ClipTriggerMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay();
    d.clear ();

    var tb = this.surface.getActiveView ().getCurrentTrackBank ();

    for (var y = 0; y < 2; y++)
    {
        for (var x = 0; x < 4; x++)
        {
            var t = tb.getTrack (x);
            d.setCell (y, x, t.slots[y].name);
        }
    }

    for (var y = 0; y < 2; y++)
    {
        for (var x = 0; x < 4; x++)
        {
            var t = tb.getTrack (x);
            d.setCell (y, x + 4, t.slots[y + 2].name);
        }
    }

    d.allDone ();
};

ClipTriggerMode.prototype.updateFirstRow = function ()
{
    var tb = this.surface.getActiveView ().getCurrentTrackBank ();
    for (var i = 0; i < 4; i++)
        this.surface.lightButton (MaschineButton.TOP_ROW_0 + i, tb.getTrack (i).mute);
    for (var i = 0; i < 4; i++)
        this.surface.lightButton (MaschineButton.TOP_ROW_4 + i, tb.getTrack (i).recarm);
};