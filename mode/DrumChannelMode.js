// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function DrumChannelMode (model)
{
    BaseMode.call (this, model);
    this.isTemporary = true;
    this.id = Maschine.MODE_DRUM_CHANNEL;
}

DrumChannelMode.prototype = new BaseMode ();

DrumChannelMode.prototype.onValueKnob = function (index, value)
{
};

DrumChannelMode.prototype.onFirstRow = function (index)
{
};

DrumChannelMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    d.clear ();

    var layers = this.model.getCursorDevice ().drumPadLayers;

    var index = 0;
    for (var i = 0; i < 4; i++)
        d.setCell (1, i, layers[index++].name);

    index = 4;
    for (var i = 0; i < 4; i++)
        d.setCell (0, i, layers[index++].name);

    index = 8;
    for (var i = 0; i < 4; i++)
        d.setCell (1, 4 + i, layers[index++].name);

    index = 12;
    for (var i = 1; i < 4; i++)
        d.setCell (0, 4 + i, layers[index++].name);

    d.allDone ();
};