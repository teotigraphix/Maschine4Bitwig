// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function SendMode (model, modeId)
{
    BaseMode.call (this, model);
    this.id = modeId;
}
SendMode.prototype = new BaseMode ();

SendMode.prototype.onValueKnob = function (index, value)
{
    var sendIndex = this.getCurrentSendIndex ();
    this.model.getCurrentTrackBank ().changeSend (index, sendIndex, value, this.surface.getFractionValue ());
};

//SendMode.prototype.onValueKnobTouch = function (index, isTouched)
//{
//    if (isTouched && this.surface.isDeletePressed ())
//    {
//        var sendIndex = this.getCurrentSendIndex ();
//        this.model.getCurrentTrackBank ().resetSend (index, sendIndex);
//    }
//};

SendMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    var sendIndex = this.getCurrentSendIndex ();
    var tb = this.model.getCurrentTrackBank ();
    var fxTrackBank = this.model.getEffectTrackBank ();

    for (var i = 0; i < 8; i++)
    {
        var t = tb.getTrack (i);
        d.setCell (0, i, t.exists ? (fxTrackBank == null ? t.sends[sendIndex].name : fxTrackBank.getTrack (sendIndex).name) : "", Display.FORMAT_RAW)
         .setCell (1, i, t.sends[sendIndex].volumeStr, Display.FORMAT_RAW);
    }
    d.done (0).done (1);
};

SendMode.prototype.getCurrentSendIndex = function ()
{
    return this.surface.getCurrentMode () - Maschine.MODE_SEND1;
};
