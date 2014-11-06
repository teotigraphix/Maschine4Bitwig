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
        case 4:
            tb.changeVolume (selectedTrack.index, value, this.surface.getFractionValue ());
            break;
        case 5:
            tb.changePan (selectedTrack.index, value, this.surface.getFractionValue ());
            break;
        case 6:
            tb.setCrossfadeModeAsNumber (selectedTrack.index, changeValue (value, tb.getCrossfadeModeAsNumber (selectedTrack.index), 1, 2));
            break;
        //default:
        //    tb.changeSend (selectedTrack.index, index - 3, value, this.surface.getFractionValue ());
        //    break;
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
        var n = optimizeName (t.name, 6);
        d.setCell (0, 0, n, Display.FORMAT_RAW);

        d.setCell (0, 4, "Volume", Display.FORMAT_RAW)
         .setCell (1, 4, t.volumeStr, Display.FORMAT_RAW)

         .setCell (0, 5, "Pan", Display.FORMAT_RAW)
         .setCell (1, 5, t.panStr, Display.FORMAT_RAW)

         .setCell (0, 6, "Crsfdr", Display.FORMAT_RAW)
         .setCell (1, 6, t.crossfadeMode == 'A' ? 'A' : (t.crossfadeMode == 'B' ? '     B' : '  <> '), Display.FORMAT_RAW);

//        var fxTrackBank = this.model.getEffectTrackBank ();
//        if (fxTrackBank != null)
//        {
//            var isFX = currentTrackBank === fxTrackBank;
//            for (var i = 0; i < 5; i++)
//            {
//                var fxTrack = fxTrackBank.getTrack (i);
//                var isEmpty = isFX || !fxTrack.exists;
//                d.setCell (0, 3 + i, isEmpty ? "" : fxTrack.name, Display.FORMAT_RAW)
//                    .setCell (1, 3 + i, isEmpty ? "" : t.sends[i].volumeStr, Display.FORMAT_RAW)
//                    .setCell (2, 3 + i, isEmpty ? "" : t.sends[i].volume, isEmpty ? Display.FORMAT_RAW : Display.FORMAT_VALUE);
//            }
//        }
//        else
//        {
//            for (var i = 0; i < 5; i++)
//            {
//                d.setCell (0, 3 + i, t.sends[i].name, Display.FORMAT_RAW)
//                    .setCell (1, 3 + i, t.sends[i].volumeStr, Display.FORMAT_RAW)
//                    .setCell (2, 3 + i, t.sends[i].volume, Display.FORMAT_VALUE);
//            }
//        }

        d.done (0).done (1).done (2);
    }

   // this.drawRow4 ();
};
