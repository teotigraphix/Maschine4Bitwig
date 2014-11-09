// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function MuteView (model)
{
    BaseMaschineView.call (this, model);

    this.pressedKey = -1;
    this.selectedMode = null;

    this.recarmIndexTranslation = [
        48, 49, 50, 51,
        44, 45, 46, 47
    ];

    this.muteIndexTranslation = [
        40, 41, 42, 43,
        36, 37, 38, 39
    ];
}

MuteView.prototype = new BaseMaschineView ();

MuteView.prototype.attachTo = function (surface)
{
    AbstractView.prototype.attachTo.call (this, surface);
};

MuteView.prototype.isRecArm = function (note)
{
    return this.recarmIndexTranslation.indexOf (note) != -1;
};

MuteView.prototype.isMute = function (note)
{
    return this.muteIndexTranslation.indexOf (note) != -1;
};

MuteView.prototype.drawGrid = function ()
{
    for (var i = 44; i < 52; i++)
    {
        var index = this.recarmIndexTranslation.indexOf (i);
        var tb = this.model.getCurrentTrackBank ();
        var t = tb.getTrack (index);
        if (t != null && t.exists)
        {
            if (i == this.pressedKey)
            {
                this.surface.pads.light (i, COLOR.RED);
            }
            else
                this.surface.pads.light (i, t.recarm ? t.selected ? COLOR.RED : COLOR.RED_MEDIUM : t.selected ? COLOR.OCEAN : COLOR.ON_DIM);
        }
        else
        {
            this.surface.pads.light (i, COLOR.OFF);
        }
    }

    for (var i = 36; i < 44; i++)
    {
        var index = this.muteIndexTranslation.indexOf (i);
        var tb = this.model.getCurrentTrackBank ();
        var t = tb.getTrack (index);
        if (t != null && t.exists)
        {
            if (i == this.pressedKey)
            {
                this.surface.pads.light (i, COLOR.GREEN);
            }
            else
                this.surface.pads.light (i, !t.mute ? t.selected ? COLOR.GREEN : COLOR.GREEN_MEDIUM : t.selected ? COLOR.OCEAN : COLOR.ON_DIM);
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
        if (this.isRecArm (note))
            this.onRecarmGridNote (note);
        else if (this.isMute (note))
            this.onMuteGridNote (note);
    }
};

MuteView.prototype.onRecarmGridNote = function (note)
{
    var tb = this.model.getCurrentTrackBank ();
    var index = this.recarmIndexTranslation.indexOf (note);
    var t = tb.getTrack (index);
    if (t != null)
        tb.toggleArm (index);
};

MuteView.prototype.onMuteGridNote = function (note)
{
    var tb = this.model.getCurrentTrackBank ();
    var index = this.muteIndexTranslation.indexOf (note);
    var t = tb.getTrack (index);
    if (t != null)
        tb.toggleMute (index);
};
