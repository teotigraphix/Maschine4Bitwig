// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under GPLv3 - http://www.gnu.org/licenses/gpl.html

function Grid (output)
{
    this.output = output;

    // Note: The grid contains only 64 pads but is more efficient to use 
    // the 128 note values the pads understand
    this.currentButtonColors = [];//initArray (COLOR.OFF, 128);
    this.buttonColors = [];//initArray (COLOR.OFF, 128);
    this.currentBlinkColors = initArray (COLOR.OFF, 128);
    this.blinkColors = initArray (COLOR.OFF, 128);
    this.currentBlinkFast = initArray (false, 128);
    this.blinkFast = initArray (false, 128);

    //this.turnOff ();
}

Grid.prototype.light = function (note, color)
{
    this.buttonColors[note] = color;
};

Grid.prototype.lightEx = function (x, y, color)
{
    this.buttonColors[36 + x + 8 * y] = color;
};

Grid.prototype.blink = function (note, color, fast)
{
    this.blinkColors[note] = color;
    this.blinkFast[note] = fast;
};

Grid.prototype.blinkEx = function (x, y, color)
{
    var note = 36 + x + 8 * y;
    this.blinkColors[note] = color;
    this.blinkFast[note] = fast;
};

Grid.prototype.flush = function ()
{
    //println("Grid.flush()");
    //println(this.currentButtonColors);
    for (var i = 36; i < 52; i++)
    {
        //if (this.currentButtonColors[i] != this.buttonColors[i])
        //{
            this.currentButtonColors[i] = this.buttonColors[i];

            var color = this.buttonColors[i];
            //var hue = Math.floor (color.hue * 127.0 / 360.0);
            //var saturation = Math.floor ((1 - Math.pow (1 - color.saturation, 2)) * 127.0);
            //var brightness = Math.floor (color.brightness * 127.0);
            //println("send " + i + ", " + hue + ", " + saturation + ", " + brightness);

            //hue = 16;
            //saturation = 0;
            //brightness = 127;

            //this.output.sendNote (i, 0);

            //this.output.sendNoteEx (0, i, color.hue);
            //this.output.sendNoteEx (1, i, color.saturation);
            //this.output.sendNoteEx (2, i, color.brightness);

            //sendChannelController(0, i, hue);
            //sendChannelController(1, i, saturation);
            //sendChannelController(2, i, brightness);
//            scheduleTask(function (index, hue) {
//                println("set hue");
//                host.getMidiOutPort(0).sendMidi(0x90 | 0, index, hue);
//            }, [i, hue], 20);
//            scheduleTask(function (index, saturation) {
//                host.getMidiOutPort(0).sendMidi(0x90 | 1, index, saturation);
//            },[i,saturation], 50);
//            scheduleTask(function (index, brightness) {
//                host.getMidiOutPort(0).sendMidi(0x90 | 2, index, brightness);
//            },[i,brightness], 60);

            baseChanged = true;
        //}
    }
//    for (var i = 36; i < 100; i++)
//    {
//        var baseChanged = false;
//        if (this.currentButtonColors[i] != this.buttonColors[i])
//        {
//            this.currentButtonColors[i] = this.buttonColors[i];
//            this.output.sendNote (i, this.buttonColors[i]);
//            baseChanged = true;
//        }
//        // No "else" here: Blinking color needs a base color
//        if (baseChanged || this.currentBlinkColors[i] != this.blinkColors[i] || this.currentBlinkFast[i] != this.blinkFast[i])
//        {
//            this.currentBlinkColors[i] = this.blinkColors[i];
//            this.currentBlinkFast[i] = this.blinkFast[i];
//
//            this.output.sendNote (i, this.currentButtonColors[i]);
//            if (this.blinkColors[i] != PUSH_COLOR_BLACK)
//                this.output.sendNoteEx (this.blinkFast[i] ? 14 : 10, i, this.blinkColors[i]);
//        }
//    }
};

Grid.prototype.turnOff = function ()
{
    //println("Grid.turnOff()");
    for (var i = 36; i < 100; i++)
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
    OCEAN : new Color(16, 56, 66),
    OFF : new Color(0, 0, 0),
    ON : new Color(66, 0, 127),

    ARM : new Color(0, 10, 10),
    PLAY : new Color(120, 127, 127)

//    ON : new Color(180.0, 0.0, 1.0),
//    OFF : new Color(0.0, 0.0, 0.0), // 180.0
//    PAD_ARROW_KEY_DISABLED : new Color(220.0, 1.0, 0.1),
//    PAD_ARROW_KEY_ENABLED : new Color(220.0, 1.0, 0.5),
//    PAD_PAGE_MODIFIER : new Color(220.0, 0.5, 0.8),
//    PAD_HOME_MODIFIER : new Color(220.0, 0.5, 0.8),
//    PAD_SHIFT_MODIFIER : new Color(65.0, 1.0, 0.4),
//    PAD_ALT_MODIFIER : new Color(70.0, 1.0, 0.4),
//    RECORD : new Color(0.0, 1.0, 1.0),
//    ARM : new Color(0.0, 1.0, 1.0),
//    MUTE : new Color(50.0, 1.0, 1.0),
//    SOLO : new Color(200.0, 1.0, 1.0),
//    PLAY : new Color(100.0, 1.0, 1.0),
//    PRESSED_NOTE_KEY : new Color(25.0, 1.0, 1.0),
//    SCENE_WITH_CONTENT : new Color(30.0, 1.0, 1.0),
//    SCENE_WITHOUT_CONTENT : new Color(30.0, 1.0, 0.5),
//    LAUNCHED_SCENE_WITH_CONTENT : new Color(200.0, 1.0, 1.0),
//    LAUNCHED_SCENE_WITHOUT_CONTENT : new Color(200.0, 1.0, 0.5),
//    EMPTY_SLOT : new Color(0.0, 0.0, 0.0),
//    EVEN_DRUM_PAD : new Color(260.0, 1.0, 0.1),
//    ODD_DRUM_PAD : new Color(340.0, 1.0, 0.1),
//    EVEN_CURSOR_DRUM_PAD : new Color(260.0, 1.0, 1.0),
//    ODD_CURSOR_DRUM_PAD : new Color(340.0, 1.0, 1.0),
//    DRUM_PAD_NOTE_ON : new Color(80.0, 0.1, 1.0),
//    ACTIVE_NOTE_STEP : new Color(60.0, 1.0, 1.0),
//    INACTIVE_NOTE_STEP : new Color(60.0, 1.0, 0.01),
//    PLAYED_ACTIVE_NOTE_STEP : new Color(150.0, 1.0, 1.0),
//    PLAYED_INACTIVE_NOTE_STEP : new Color(150.0, 1.0, 0.1),
//    UNSELECTED_TOGGLE_BRIGHTNESS_FACTOR : 0.1
};

var NOTE_BLACK = COLOR.OFF;
var NOTE_WHITE = COLOR.ON;
var NOTE_OCEAN = COLOR.OCEAN;
