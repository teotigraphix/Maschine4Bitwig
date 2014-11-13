// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function TrackViewMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_PAN;
}

TrackViewMode.prototype = new BaseMode ();

TrackViewMode.prototype.onValueKnob = function (index, value)
{
};

TrackViewMode.prototype.onFirstRow = function (index)
{
};

TrackViewMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    d.clear ();
    var tb = this.model.getCurrentTrackBank ();

    var row = 1;
    var column = 0;
    for (var i = 0; i < 4; i++)
    {
        var t = tb.getTrack (i);
        var n = optimizeName (t.name, t.selected ? 5 : 6);
        if (t.selected)
            n = ">" + n;

        d.setCell (row, column, t.exists ? n : "");
        column++;
    }

    row = 0;
    column = 0;
    for (var i = 4; i < 8; i++)
    {
        var t = tb.getTrack (i);
        var n = optimizeName (t.name, t.selected ? 5 : 6);
        if (t.selected)
            n = ">" + n;

        d.setCell (row, column, t.exists ? n : "");
        column++;
    }

    if (tb.canScrollTracksDown ())
        d.setCell (0, 6, "< Prev");
    if (tb.canScrollTracksUp ())
        d.setCell (0, 7, "Next >");

    d.done (0).done (1);
};
