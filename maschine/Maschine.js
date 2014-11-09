// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

Maschine.VERSION = "0.1.3";

Maschine.STUDIO = 0;
Maschine.MK2 = 1;
Maschine.MIKROMK2 = 2;
Maschine.MK1 = 3;

Maschine.INSTANCE = -1;

Maschine.MODE_BANK_DEVICE = 0;
Maschine.MODE_SCALE = 1;
Maschine.MODE_NAVIGATE = 2;
Maschine.MODE_TRACK = 3;
Maschine.MODE_VOLUME = 4;
Maschine.MODE_SELECT = 5;

Maschine.MODE_SEND1 = 6;
Maschine.MODE_SEND2 = 7;
Maschine.MODE_SEND3 = 8;
Maschine.MODE_SEND4 = 9;
Maschine.MODE_PAN = 10;

Maschine.MODE_SCALE_LAYOUT = 11;
Maschine.MODE_CLIP = 12;
Maschine.MODE_XFADE = 13;
Maschine.MODE_MASTER = 14;
Maschine.MODE_GROOVE = 15;
Maschine.MODE_FRAME = 16;
Maschine.MODE_ACCENT = 17

Maschine.MODE_PARAM_PAGE_SELECT = 20;
Maschine.MODE_BANK_COMMON = 21;
Maschine.MODE_BANK_ENVELOPE = 22;
Maschine.MODE_BANK_DIRECT = 23;
Maschine.MODE_BANK_MACRO = 24;
Maschine.MODE_BANK_MODULATE = 25;
Maschine.MODE_BANK_USER = 26;
Maschine.MODE_PRESET = 27;

Maschine.BANK_MODES = [
    Maschine.MODE_BANK_COMMON,
    Maschine.MODE_BANK_ENVELOPE,
    Maschine.MODE_BANK_DIRECT,
    Maschine.MODE_BANK_MACRO,
    Maschine.MODE_BANK_MODULATE,
    Maschine.MODE_BANK_USER
];

Maschine.isDeviceBankMode = function (modeId)
{
    return Maschine.BANK_MODES.indexOf (modeId) != -1;
}

Maschine.VIEW_PLAY         = 0;
Maschine.VIEW_MODE         = 1;
Maschine.VIEW_DRUM         = 2;
Maschine.VIEW_SEQUENCER    = 3;
Maschine.VIEW_SESSION      = 4;
Maschine.VIEW_EIDT_TOOLS   = 5;
Maschine.VIEW_MUTE         = 6;
Maschine.VIEW_SOLO         = 7;

Maschine.MODES = [
    [Maschine.MODE_BANK_DEVICE, "Device"],
    [Maschine.MODE_TRACK, "Track"],
    [Maschine.MODE_VOLUME, "Volume"],
    [Maschine.MODE_PAN, "Pan"],

    [Maschine.MODE_SEND1, "Send1"],
    [Maschine.MODE_SEND2, "Send2"],
    [Maschine.MODE_SEND3, "Send3"],
    [Maschine.MODE_SEND4, "Send4"],

    [Maschine.MODE_SCALE, "Scale"],
    [Maschine.MODE_SCALE_LAYOUT, "SclLay"],
    [Maschine.MODE_CLIP, "Clip"],
    [Maschine.MODE_XFADE, "XFade"],

    [Maschine.MODE_MASTER, "Master"],
    [Maschine.MODE_GROOVE, "Groove"],
    [Maschine.MODE_FRAME, "Frame"],
    [Maschine.MODE_ACCENT, "Accent"]
];

// TEMP
Maschine.getModeName = function (modeId)
{
    for (var i = 0; i < Maschine.MODES.length; i++)
    {
        if (Maschine.MODES[i][0] == modeId)
            return Maschine.MODES[i][1];
    }
};

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
