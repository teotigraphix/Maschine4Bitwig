// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function Grid (output)
{
    this.output = output;

    // Note: The grid contains only 16 pads but is more efficient to use
    // the 128 note values the pads understand
    this.currentButtonColors = initArray (COLOR.OFF, 128);
    this.buttonColors = initArray (COLOR.OFF, 128);
    this.currentBlinkColors = initArray (COLOR.OFF, 128);
    this.blinkColors = initArray (COLOR.OFF, 128);
    this.currentBlinkFast = initArray (false, 128);
    this.blinkFast = initArray (false, 128);
}

Grid.prototype.light = function (note, color)
{
    this.buttonColors[note] = color;
};

Grid.prototype.lightEx = function (x, y, color)
{
    this.buttonColors[48 + x - 4 * y] = color;
    //this.setLight (92 + x - 8 * y, color, blinkColor, fast);
};

Grid.prototype.blink = function (note, color, fast)
{
    this.blinkColors[note] = color;
    this.blinkFast[note] = fast;
};

Grid.prototype.blinkEx = function (x, y, color)
{
    var note = 36 + x + 4 * y;
    this.blinkColors[note] = color;
    this.blinkFast[note] = fast;
};

Grid.prototype.flush = function ()
{
    for (var i = 36; i < 52; i++)
    {
        if (this.currentButtonColors[i] != this.buttonColors[i])
        {
            this.currentButtonColors[i] = this.buttonColors[i];

            var color = this.buttonColors[i];
            this.sendColor (i, color);
        }
    }
};

Grid.prototype.sendColor = function (channel, color)
{
    //println(color.hue);
    var hue = Math.floor (color.hue * 127.0 / 360.0);
    var saturation = Math.floor ((1 - Math.pow (1 - color.saturation, 2)) * 127.0);
    var brightness = Math.floor (color.brightness * 127.0);
    //println("send " + i + ", " + hue + ", " + saturation + ", " + brightness);

    this.output.sendNoteEx (0, channel, hue);
    this.output.sendNoteEx (1, channel, saturation);
    this.output.sendNoteEx (2, channel, brightness);
}

Grid.prototype.turnOff = function ()
{
    for (var i = 36; i < 52; i++)
        this.light (i, COLOR.OFF);
    this.flush ();
};

function Color(hue, saturation, brightness)
{
    this.hue = hue;
    this.saturation = saturation;
    this.brightness = brightness;
};



var COLOR =
{
    OCEAN : new Color(210.0, 1, 1.0),

    OFF : new Color(0.0, 0.0, 0.0),
    ON : new Color(180.0, 0.0, 1.0),
    ON_MEDIUM : new Color(180.0, 0.0, 0.5),
    ON_DIM : new Color(180.0, 0.0, 0.25),

    GREEN : new Color(100.0, 1.0, 1.0),
    GREEN_MEDIUM : new Color(100.0, 1.0, 0.5),
    GREEN_DIM : new Color(100.0, 1.0, 0.25),

    RED : new Color(0.0, 1.0, 1.0),
    RED_MEDIUM : new Color(0.0, 1.0, 0.5),
    RED_DIM : new Color(0.0, 1.0, 0.25),

    ARM : new Color(0.0, 1.0, 1.0),
    PLAY : new Color(100.0, 1.0, 1.0),

    PAD_ARROW_KEY_DISABLED : new Color(220.0, 1.0, 0.1),
    PAD_ARROW_KEY_ENABLED : new Color(220.0, 1.0, 0.5),
    PAD_PAGE_MODIFIER : new Color(220.0, 0.5, 0.8),
    PAD_HOME_MODIFIER : new Color(220.0, 0.5, 0.8),
    PAD_SHIFT_MODIFIER : new Color(65.0, 1.0, 0.4),
    PAD_ALT_MODIFIER : new Color(70.0, 1.0, 0.4),
    RECORD : new Color(0.0, 1.0, 1.0),
    MUTE : new Color(50.0, 1.0, 1.0),
    SOLO : new Color(200.0, 1.0, 1.0),
    PRESSED_NOTE_KEY : new Color(25.0, 1.0, 1.0),
    SCENE_WITH_CONTENT : new Color(30.0, 1.0, 1.0),
    SCENE_WITHOUT_CONTENT : new Color(30.0, 1.0, 0.5),
    LAUNCHED_SCENE_WITH_CONTENT : new Color(200.0, 1.0, 1.0),
    LAUNCHED_SCENE_WITHOUT_CONTENT : new Color(200.0, 1.0, 0.5),
    EMPTY_SLOT : new Color(0.0, 0.0, 0.0),
    EVEN_DRUM_PAD : new Color(260.0, 1.0, 0.1),
    ODD_DRUM_PAD : new Color(340.0, 1.0, 0.1),
    EVEN_CURSOR_DRUM_PAD : new Color(260.0, 1.0, 1.0),
    ODD_CURSOR_DRUM_PAD : new Color(340.0, 1.0, 1.0),
    DRUM_PAD_NOTE_ON : new Color(80.0, 0.1, 1.0),
    ACTIVE_NOTE_STEP : new Color(60.0, 1.0, 1.0),
    INACTIVE_NOTE_STEP : new Color(60.0, 1.0, 0.01),
    PLAYED_ACTIVE_NOTE_STEP : new Color(150.0, 1.0, 1.0),
    PLAYED_INACTIVE_NOTE_STEP : new Color(150.0, 1.0, 0.1),
    UNSELECTED_TOGGLE_BRIGHTNESS_FACTOR : 0.1
};

Scales.SCALE_COLOR_OFF          = COLOR.OFF;
Scales.SCALE_COLOR_OCTAVE       = COLOR.OCEAN;
Scales.SCALE_COLOR_NOTE         = COLOR.ON;
Scales.SCALE_COLOR_OUT_OF_SCALE = COLOR.OFF;