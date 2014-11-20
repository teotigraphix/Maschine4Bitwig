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

function Color (hue, saturation, brightness, id)
{
    this.hue = hue;
    this.saturation = saturation;
    this.brightness = Math.max (brightness, id == 0 ? 0.0 : 0.05);
    this.id = id;
};

Color.dim = function (color, percent)
{
    return new Color (color.hue, color.saturation, color.brightness * percent, color.id);
};

function BitwigColor ()
{
}

BitwigColor.getColor = function (id, isDim)
{
    var colors = !isDim ? COLOR_BITWIG : COLOR_BITWIG_DIM;
    for (var name in colors)
    {
        if (colors[name].id == id)
            return colors[name];
    }
    return null;
};

var COLOR_BITWIG =
{
    GRAY_DARK: new Color(0, 0.0, 0.1, 1), // DarkGray
    GRAY: new Color(60, 0.2, 0.48, 2), // Gray
    GRAY_LIGHT: new Color(180, 0.0, 0.95, 3), // LightGray
    SILVER: new Color(235, 0.21, 0.67, 40), // LightSlateGray
    BROWN_DARK: new Color(35, 0.58, 0.64, 11), // PeruBrown
    BROWN: new Color(30, 0.40, 0.78, 12), // DarkKhakiBrown
    BLUE_DARK: new Color(235, 0.57, 0.8, 42), // SlateBlue
    BLUE_LIGHT: new Color(237, 0.45, 0.93, 44), // MediumSlateBlue
    PURPLE: new Color(275, 0.64, 0.8, 58), // DarkOrchid
    PINK: new Color(339, 0.74, 0.85, 57), // IndianRed
    RED: new Color(3, 0.83, 0.85, 6), // Crimson
    ORANGE: new Color(20, 0.98, 1, 60), // OrangeRed
    ORANGE_LIGHT: new Color(42, 0.93, 0.85, 62), // Goldenrod
    GREEN: new Color(77, 0.87, 0.60, 18), // OliveDrab
    GREEN_COLD: new Color(147, 1, 0.62, 26), // SeaGreen
    GREEN_BLUISH: new Color(173, 1, 0.65, 30), // DarkCyan
    TURQUOISE: new Color(198, 1, 0.85, 37), // DarkTurquoise
    PURPLE_LIGHT: new Color(274, 0.51, 0.94, 48), // Orchid
    PINK_LIGHT: new Color(339, 0.55, 0.88, 56), // PaleVioletRed
    SKIN: new Color(4, 0.63, 0.93, 4), // Tomato
    BROWN_REDISH: new Color(21, 0.76, 1, 10), // Coral
    BROWN_LIGHT: new Color(42, 0.66, 0.89, 61), // SandyBrown
    GREEN_LIGHT: new Color(77, 0.60, 0.75, 18), // YellowGreen
    GREEN_MEDIUM: new Color(137, 0.67, 0.73, 25), // MediumSeaGreen
    TURQUOISE_MEDIUM: new Color(170, 0.68, 0.82, 32), // MediumTurquoise
    CYAN: new Color(198, 0.73, 1, 41) // Cyan
};

var COLOR_DIM = 0.5;

var COLOR_BITWIG_DIM =
{
    GRAY_DARK: new Color(0, 0.0, 0.1, 1), // DarkGray
    GRAY: new Color(60, 0.2, 0.48 - COLOR_DIM, 2), // Gray
    GRAY_LIGHT: new Color(180, 0.0, 0.95 - COLOR_DIM, 3), // LightGray
    SILVER: new Color(235, 0.21, 0.67 - COLOR_DIM, 40), // LightSlateGray
    BROWN_DARK: new Color(35, 0.58, 0.64 - COLOR_DIM, 11), // PeruBrown
    BROWN: new Color(30, 0.40, 0.78 - COLOR_DIM, 12), // DarkKhakiBrown
    BLUE_DARK: new Color(235, 0.57, 0.8 - COLOR_DIM, 42), // SlateBlue
    BLUE_LIGHT: new Color(237, 0.45, 0.93 - COLOR_DIM, 44), // MediumSlateBlue
    PURPLE: new Color(275, 0.64, 0.8 - COLOR_DIM, 58), // DarkOrchid
    PINK: new Color(339, 0.74, 0.85 - COLOR_DIM, 57), // IndianRed
    RED: new Color(3, 0.83, 0.85 - COLOR_DIM, 6), // Crimson
    ORANGE: new Color(20, 0.98, 1 - COLOR_DIM, 60), // OrangeRed
    ORANGE_LIGHT: new Color(42, 0.93, 0.85 - COLOR_DIM, 62), // Goldenrod
    GREEN: new Color(77, 0.87, 0.60 - COLOR_DIM, 18), // OliveDrab
    GREEN_COLD: new Color(147, 1, 0.62 - COLOR_DIM, 26), // SeaGreen
    GREEN_BLUISH: new Color(173, 1, 0.65 - COLOR_DIM, 30), // DarkCyan
    TURQUOISE: new Color(198, 1, 0.85 - COLOR_DIM, 37), // DarkTurquoise
    PURPLE_LIGHT: new Color(274, 0.51, 0.94 - COLOR_DIM, 48), // Orchid
    PINK_LIGHT: new Color(339, 0.55, 0.88 - COLOR_DIM, 56), // PaleVioletRed
    SKIN: new Color(4, 0.63, 0.93 - COLOR_DIM, 4), // Tomato
    BROWN_REDISH: new Color(21, 0.76, 1 - COLOR_DIM, 10), // Coral
    BROWN_LIGHT: new Color(42, 0.66, 0.89 - COLOR_DIM, 61), // SandyBrown
    GREEN_LIGHT: new Color(77, 0.60, 0.75 - COLOR_DIM, 18), // YellowGreen
    GREEN_MEDIUM: new Color(137, 0.67, 0.73 - COLOR_DIM, 25), // MediumSeaGreen
    TURQUOISE_MEDIUM: new Color(170, 0.68, 0.82 - COLOR_DIM, 32), // MediumTurquoise
    CYAN: new Color(198, 0.73, 1 - COLOR_DIM, 41) // Cyan
};

var COLOR =
{
    OFF : new Color(0.0, 0.0, 0.0, 0),
    ON : new Color(180.0, 0.0, 1.0),
    ON_MEDIUM : new Color(180.0, 0.0, 0.5),
    ON_DIM : new Color(180.0, 0.0, 0.25),

    RED : new Color(0.0, 1.0, 1.0),
    RED_MEDIUM : new Color(0.0, 1.0, 0.5),
    RED_DIM : new Color(0.0, 1.0, 0.25),

    GREEN : new Color(120, 1.0, 1.0),
    GREEN_MEDIUM : new Color(120.0, 1.0, 0.5),
    GREEN_DIM : new Color(120.0, 1.0, 0.25),

    BLUE : new Color(240.0, 1.0, 1.0),
    BLUE_MEDIUM : new Color(240.0, 1.0, 0.5),
    BLUE_DIM : new Color(240.0, 1.0, 0.25),

    AQUA : new Color(180.0, 0.6, 1.0),
    AQUA_MEDIUM : new Color(180.0, 0.6, 0.5),
    AQUA_DIM : new Color(180.0, 0.6, 0.25),
    AQUA_OFF : new Color(180.0, 0.6, 0.05),

    YELLOW : new Color(60.0, 1.0, 1.0),
    YELLOW_MEDIUM : new Color(60.0, 1.0, 0.5),
    YELLOW_DIM : new Color(60.0, 1.0, 0.25),

    OCEAN : new Color(198.0, 0.73, 1.0)
};

Scales.SCALE_COLOR_OFF          = COLOR.OFF;
Scales.SCALE_COLOR_OCTAVE       = COLOR.OCEAN;
Scales.SCALE_COLOR_NOTE         = COLOR.ON;
Scales.SCALE_COLOR_OUT_OF_SCALE = COLOR.OFF;