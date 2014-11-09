// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function SoloView (model)
{
    BaseMaschineView.call (this, model);

    this.pressedKey = -1;

    this.monitorIndexTranslation = [
        48, 49, 50, 51,
        44, 45, 46, 47
    ];

    this.soloIndexTranslation = [
        40, 41, 42, 43,
        36, 37, 38, 39
    ];
}

SoloView.prototype = new BaseMaschineView ();

SoloView.prototype.attachTo = function (surface)
{
    AbstractView.prototype.attachTo.call (this, surface);
};

SoloView.prototype.isMonitor = function (note)
{
    return this.monitorIndexTranslation.indexOf (note) != -1;
};

SoloView.prototype.isSolo = function (note)
{
    return this.soloIndexTranslation.indexOf (note) != -1;
};

SoloView.prototype.drawGrid = function ()
{
    for (var i = 44; i < 52; i++)
    {
        var index = this.monitorIndexTranslation.indexOf (i);
        var tb = this.model.getCurrentTrackBank ();
        var t = tb.getTrack (index);
        if (t != null && t.exists)
        {
            if (i == this.pressedKey)
            {
                this.surface.pads.light (i, COLOR.GREEN);
            }
            else
                this.surface.pads.light (i, t.monitor ? t.selected ? COLOR.GREEN : COLOR.GREEN_MEDIUM : t.selected ? COLOR.OCEAN : COLOR.ON_DIM);
        }
        else
        {
            this.surface.pads.light (i, COLOR.OFF);
        }
    }

    for (var i = 36; i < 44; i++)
    {
        var index = this.soloIndexTranslation.indexOf (i);
        var tb = this.model.getCurrentTrackBank ();
        var t = tb.getTrack (index);
        if (t != null && t.exists)
        {
            if (i == this.pressedKey)
            {
                this.surface.pads.light (i, COLOR.YELLOW);
            }
            else
                this.surface.pads.light (i, t.solo ? t.selected ? COLOR.YELLOW : COLOR.YELLOW_MEDIUM : t.selected ? COLOR.OCEAN : COLOR.ON_DIM);
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
        if (this.isMonitor (note))
            this.onMonitorGridNote (note);
        else if (this.isSolo (note))
            this.onSoloGridNote (note);
    }
};

SoloView.prototype.onMonitorGridNote = function (note)
{
    var tb = this.model.getCurrentTrackBank ();
    var index = this.monitorIndexTranslation.indexOf (note);
    var t = tb.getTrack (index);
    if (t != null)
        tb.toggleMonitor (index);
};

SoloView.prototype.onSoloGridNote = function (note)
{
    var tb = this.model.getCurrentTrackBank ();
    var index = this.soloIndexTranslation.indexOf (note);
    var t = tb.getTrack (index);
    if (t != null)
        tb.toggleSolo (index);
};