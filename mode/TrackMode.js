// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function TrackMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_TRACK;
}
TrackMode.prototype = new BaseMode ();

TrackMode.prototype.onValueKnob = function (index, value)
{
    var tb = this.model.getCurrentTrackBank ();
    var selectedTrack = tb.getSelectedTrack ();
    if (selectedTrack == null)
        return;
    switch (index)
    {
        case 2:
            tb.changeVolume (selectedTrack.index, value, this.surface.getFractionValue ());
            break;
        case 3:
            tb.changePan (selectedTrack.index, value, this.surface.getFractionValue ());
            break;
        case 4:
            tb.setCrossfadeModeAsNumber (selectedTrack.index, changeValue (value, tb.getCrossfadeModeAsNumber (selectedTrack.index), 1, 2));
            break;
        case 5:
        case 6:
        case 7:
            tb.changeSend (selectedTrack.index, index - 5, value, this.surface.getFractionValue ());
            break;
    }
};

TrackMode.prototype.onFirstRow = function (index)
{
    var tb = this.model.getCurrentTrackBank ();
    var selectedTrack = tb.getSelectedTrack ();
    if (selectedTrack == null)
        return;

    switch (index)
    {
        case 0:
            tb.toggleMute (selectedTrack.index);
            break;
        case 1:
            tb.toggleSolo (selectedTrack.index);
            break;
        case 2:
            tb.toggleArm (selectedTrack.index);
            break;
    }
};

TrackMode.prototype.updateDisplay = function ()
{
    var currentTrackBank = this.model.getCurrentTrackBank ();
    var t = currentTrackBank.getSelectedTrack ();
    var d = this.surface.getDisplay ();
    d.clear ();

    if (t == null)
        d.setRow (1, "                     Please select a track...                       ")
            .clearRow (0).clearRow (2).done (0).done (2);
    else
    {
        d.setCell (0, 0, 'Mute');
        d.setCell (0, 1, 'Solo');
        d.setBlock (1, 0, t.name);

        d.setCell (0, 2, "Volume", Display.FORMAT_RAW)
         .setCell (1, 2, t.volumeStr, Display.FORMAT_RAW)

         .setCell (0, 3, "  Pan", Display.FORMAT_RAW)
         .setCell (1, 3, t.panStr, Display.FORMAT_RAW)

         .setCell (0, 4, "Crsfdr", Display.FORMAT_RAW)
         .setCell (1, 4, t.crossfadeMode == 'A' ? 'A' : (t.crossfadeMode == 'B' ? '     B' : '  <> '), Display.FORMAT_RAW);

        var fxTrackBank = this.model.getEffectTrackBank ();
        if (fxTrackBank != null)
        {
            var isFX = currentTrackBank === fxTrackBank;
            for (var i = 0; i < 3; i++)
            {
                var fxTrack = fxTrackBank.getTrack (i);
                var isEmpty = isFX || !fxTrack.exists;
                d.setCell (0, 5 + i, isEmpty ? "" : fxTrack.name, Display.FORMAT_RAW)
                    .setCell (1, 5 + i, isEmpty ? "" : t.sends[i].volumeStr, Display.FORMAT_RAW);
            }
        }
        else
        {
            for (var i = 0; i < 3; i++)
            {
                d.setCell (0, 5 + i, t.sends[i].name, Display.FORMAT_RAW)
                    .setCell (1, 5 + i, t.sends[i].volumeStr, Display.FORMAT_RAW);
            }
        }

        d.done (0).done (1);
    }
};

TrackMode.prototype.updateFirstRow = function ()
{
    this.clearTopRow ();
    var currentTrackBank = this.model.getCurrentTrackBank ();
    var t = currentTrackBank.getSelectedTrack ();
    if (t == null)
        return;

    this.surface.setButton (MaschineButton.TOP_ROW_0, t.mute ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.TOP_ROW_1, t.solo ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.TOP_ROW_2, t.recarm ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);
};