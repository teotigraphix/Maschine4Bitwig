// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

TrackMode.DISPLAY_BUTTON_LABELS = 0;
TrackMode.DISPLAY_KNOB_LABELS = 1;

function TrackMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_TRACK;
    this.topDisplayMode = 0;
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
        case 5:
        case 6:
        case 7:
            tb.changeSend (selectedTrack.index, index - 4, value, this.surface.getFractionValue ());
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
        case 3:
            tb.toggleAutoMonitor (selectedTrack.index);
            break;
        case 7:
            this.toggleDisplay ();
            this.updateDisplay ();
            this.showTopRowNotification ();
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
    {
        d.setRow (1, "                     Please select a track...                       ")
            .clearRow (0).clearRow (2).done (0).done (2);
    }
    else
    {
        switch (this.topDisplayMode)
        {
            case TrackMode.DISPLAY_BUTTON_LABELS:
                this.drawButtonLabels ();
                break;
            case TrackMode.DISPLAY_KNOB_LABELS:
                this.drawKnobLabels ();
                break;
        }

        this.drawValueLabels ();
    }
};

TrackMode.prototype.updateFirstRow = function ()
{
    var currentTrackBank = this.model.getCurrentTrackBank ();
    var t = currentTrackBank.getSelectedTrack ();
    if (t == null)
        return;

    this.surface.lightButton (MaschineButton.TOP_ROW_0, t.mute);
    this.surface.lightButton (MaschineButton.TOP_ROW_1, t.solo);
    this.surface.lightButton (MaschineButton.TOP_ROW_2, t.recarm);
    this.surface.lightButton (MaschineButton.TOP_ROW_3, t.monitor);

    this.surface.lightButton (MaschineButton.TOP_ROW_7, true);
};

//--------------------------------------
// Protected :: Methods
//--------------------------------------

TrackMode.prototype.showTopRowNotification = function ()
{
    switch (this.topDisplayMode)
    {
        case 0:
            this.surface.getDisplay ().showNotificationLeft("Top row display :", "Button labels", 500);
            break;
        case 1:
            this.surface.getDisplay ().showNotificationLeft("Top row display :", "Knob labels", 500);
            break;
    }
};

TrackMode.prototype.toggleDisplay = function ()
{
    switch (this.topDisplayMode)
    {
        case TrackMode.DISPLAY_BUTTON_LABELS:
            this.topDisplayMode = TrackMode.DISPLAY_KNOB_LABELS;
            break;
        case TrackMode.DISPLAY_KNOB_LABELS:
            this.topDisplayMode = TrackMode.DISPLAY_BUTTON_LABELS;
            break;
    }
};

TrackMode.prototype.drawButtonLabels = function ()
{
    var currentTrackBank = this.model.getCurrentTrackBank ();
    var t = currentTrackBank.getSelectedTrack ();

    var d = this.surface.getDisplay ();

    d.setCell (0, 0, 'Mute');
    d.setCell (0, 1, ' Solo');
    d.setCell (0, 2, 'RecArm');
    d.setCell (0, 3, 'Monitr');
    d.setCell (0, 4, '');
    d.setCell (0, 5, '');
    d.setCell (0, 6, '');
    d.setCell (0, 7, '');

    d.done (0);
};

TrackMode.prototype.drawKnobLabels = function ()
{
    var currentTrackBank = this.model.getCurrentTrackBank ();
    var t = currentTrackBank.getSelectedTrack ();

    var d = this.surface.getDisplay ();

    d.setCell (0, 0, '');
    d.setCell (0, 1, '');
    d.setCell (0, 2, 'Volume');
    d.setCell (0, 3, '  Pan');

    var fxTrackBank = this.model.getEffectTrackBank ();
    if (fxTrackBank != null)
    {
        var isFX = currentTrackBank === fxTrackBank;
        for (var i = 0; i < 4; i++)
        {
            var fxTrack = fxTrackBank.getTrack (i);
            var isEmpty = isFX || !fxTrack.exists;
            d.setCell (0, 4 + i, isEmpty ? "" : fxTrack.name, Display.FORMAT_RAW);
        }
    }
    else
    {
        for (var i = 0; i < 4; i++)
        {
            d.setCell (0, 4 + i, t.sends[i].name, Display.FORMAT_RAW);
        }
    }
    d.done (0);
};

TrackMode.prototype.drawValueLabels = function ()
{
    var currentTrackBank = this.model.getCurrentTrackBank ();
    var t = currentTrackBank.getSelectedTrack ();

    var d = this.surface.getDisplay ();

    d.setBlock (1, 0, t.name)
        .setCell (1, 2, t.volumeStr, Display.FORMAT_RAW)
        .setCell (1, 3, t.panStr, Display.FORMAT_RAW);

//         .setCell (0, 4, "Crsfdr", Display.FORMAT_RAW)
//         .setCell (1, 4, t.crossfadeMode == 'A' ? 'A' : (t.crossfadeMode == 'B' ? '     B' : '  <> '), Display.FORMAT_RAW);

    var fxTrackBank = this.model.getEffectTrackBank ();
    if (fxTrackBank != null)
    {
        var isFX = currentTrackBank === fxTrackBank;
        for (var i = 0; i < 4; i++)
        {
            var fxTrack = fxTrackBank.getTrack (i);
            var isEmpty = isFX || !fxTrack.exists;
            d.setCell (1, 4 + i, isEmpty ? "" : t.sends[i].volumeStr, Display.FORMAT_RAW);
        }
    }
    else
    {
        for (var i = 0; i < 4; i++)
        {
            d.setCell (1, 4 + i, t.sends[i].volumeStr, Display.FORMAT_RAW);
        }
    }

    d.done (1);
};
