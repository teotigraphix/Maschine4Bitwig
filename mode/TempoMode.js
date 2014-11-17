// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function TempoMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_TEMPO;
    this.isTemporary = true;
}

TempoMode.prototype = new BaseMode ();

TempoMode.prototype.onValueKnob = function (index, value)
{
};

TempoMode.prototype.onFirstRow = function (event, index)
{
};

TempoMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    d.clear ();
    var bpm = parseFloat (Math.round (this.model.getTransport ().getTempo () * 100) / 100).toFixed (2);
    d.setBlock (0, 0, "Current Tempo:");
    d.setBlock (0, 1, bpm + " BPM");
    d.allDone ();
};