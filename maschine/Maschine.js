// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

Maschine.VERSION = "0.1";

Maschine.STUDIO = 0;
Maschine.MK2 = 1;
Maschine.MIKROMK2 = 2;
Maschine.MK1 = 3;

Maschine.INSTANCE = -1;

Maschine.MODE_BANK_DEVICE = 0;
Maschine.MODE_SCALE = 1;
Maschine.MODE_NAVIGATE = 2;

Maschine.VIEW_PLAY      = 0;
Maschine.VIEW_DRUM      = 1;
Maschine.VIEW_SEQUENCER = 2;
Maschine.VIEW_SESSION   = 3;
Maschine.VIEW_EIDT_TOOLS   = 4;

function Maschine (output, input, buttons)
{
    if (output == null)
        return;

    AbstractControlSurface.call (this, output, input, buttons);

    for (var i = 36; i < 52; i++)
        this.gridNotes.push (i);
}

Maschine.prototype = new AbstractControlSurface ();

//--------------------------------------
// Display
//--------------------------------------

Maschine.prototype.setButton = function (button, state)
{
    this.output.sendCC (button, state);
};

Maschine.prototype.sendColor = function (channel, color)
{
    var hue = Math.floor (color.hue * 127.0 / 360.0);
    var saturation = Math.floor ((1 - Math.pow (1 - color.saturation, 2)) * 127.0);
    var brightness = Math.floor (color.brightness * 127.0);
    //println("send " + i + ", " + hue + ", " + saturation + ", " + brightness);

    this.sendCCEx (0, channel, hue);
    this.sendCCEx (1, channel, saturation);
    this.sendCCEx (2, channel, brightness);
};

Maschine.prototype.sendCCEx = function (channel, cc, value)
{
    host.getMidiOutPort (0).sendMidi (0xB0 | channel, cc, value);
};

Maschine.prototype.shutdown = function ()
{
    // Clear display
    this.display.clear ().allDone ();

    // Turn off all buttons
    for (var i = 0; i < this.buttons.length; i++)
        this.setButton (this.buttons[i], MaschineButton.STATE_UP);

    // Turn off row buttons
    for (var i = MaschineButton.TOP_ROW_0; i <= MaschineButton.TOP_ROW_7; i++)
        this.setButton (i, MaschineButton.STATE_UP);

    // Turn off group buttons
    for (var i = MaschineButton.GROUP_A; i <= MaschineButton.GROUP_H; i++)
        this.sendColor (i, COLOR.OFF);

    this.pads.turnOff ();
};
