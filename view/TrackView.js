// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function TrackView (model)
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

    this.trackBank = new TrackBankProxy (16, 4, 4);
}

TrackView.prototype = new BaseMaschineView ();

TrackView.prototype.attachTo = function (surface)
{
    AbstractView.prototype.attachTo.call (this, surface);
};

TrackView.prototype.drawGrid = function ()
{
    for (var i = 36; i < 52; i++)
    {
        var index = this.indexTranslation.indexOf (i);
        var track = this.getCurrentTrackBank ().getTrack (index);
        if (track != null && track.exists)
        {
            this.surface.pads.light (i, (i == this.pressedKey) ? COLOR.ON : BitwigColor.getColor (track.color));
        }
        else
        {
            this.surface.pads.light (i, COLOR.OFF);
        }
    }

    var tb = this.getCurrentTrackBank ();
    this.surface.pads.light (50, (50 == this.pressedKey) ? COLOR.ON_MEDIUM : tb.canScrollTracksUp () ? COLOR.ON : COLOR.ON_DIM);
    this.surface.pads.light (51, (51 == this.pressedKey) ? COLOR.ON_MEDIUM : tb.canScrollTracksDown () ? COLOR.ON : COLOR.ON_DIM);
};

TrackView.prototype.onGridNote = function (note, velocity)
{
    this.pressedKey = -1;
    if (velocity > 0)
    {
        var tb = this.getCurrentTrackBank ();
        this.pressedKey = note;
        if (note < 44)
            tb.select (note - 36);
        else if (note == 50)
            tb.scrollTracksPageUp ();
        else if (note == 51)
            tb.scrollTracksPageDown ();
    }
};