// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function Maschine ()
{
}

Maschine.MODE_BANK_DEVICE = 0;
Maschine.MODE_SCALE = 1;
Maschine.MODE_NAVIGATE = 2;

Maschine.VIEW_PLAY      = 0;
Maschine.VIEW_DRUM      = 1;
Maschine.VIEW_SEQUENCER = 2;
Maschine.VIEW_SESSION   = 3;
Maschine.VIEW_EIDT_TOOLS   = 4;

MaschineStudio.VIEW_PLAY      = 0;
MaschineStudio.VIEW_DRUM      = 1;
MaschineStudio.VIEW_SEQUENCER = 2;
MaschineStudio.VIEW_SESSION   = 3;

MaschineStudio.MODE_BANK_DEVICE = 0;
MaschineStudio.MODE_SCALE = 1;

function MaschineStudio (output, input)
{
    // array of cc numbers that are used in the
    var buttons = [
        MaschineButton.CHANNEL,
        MaschineButton.PLUGIN,
        MaschineButton.ARRANGE,
        MaschineButton.MIX,
        MaschineButton.BROWSE,
        MaschineButton.SAMPLING,

        MaschineButton.ALL,
        MaschineButton.AUTO,

        MaschineButton.TOP_ROW_0,
        MaschineButton.TOP_ROW_1,
        MaschineButton.TOP_ROW_2,
        MaschineButton.TOP_ROW_3,
        MaschineButton.TOP_ROW_4,
        MaschineButton.TOP_ROW_5,
        MaschineButton.TOP_ROW_6,
        MaschineButton.TOP_ROW_7,

        // Encoders
        MaschineButton.ENCODER_1,
        MaschineButton.ENCODER_2,
        MaschineButton.ENCODER_3,
        MaschineButton.ENCODER_4,
        MaschineButton.ENCODER_5,
        MaschineButton.ENCODER_6,
        MaschineButton.ENCODER_7,
        MaschineButton.ENCODER_8,

        MaschineButton.IN1,
        MaschineButton.IN2,
        MaschineButton.IN3,
        MaschineButton.IN4,
        MaschineButton.MST,
        MaschineButton.GRP,
        MaschineButton.SND,
        MaschineButton.CUE,
        MaschineButton.ENCODER_LARGE,

        // Performance
        MaschineButton.TAP,
        MaschineButton.STEP_MODE,
        MaschineButton.MACRO,
        MaschineButton.NOTE_REPEAT,

        // Groups
        MaschineButton.GROUP_A,
        MaschineButton.GROUP_B,
        MaschineButton.GROUP_C,
        MaschineButton.GROUP_D,
        MaschineButton.GROUP_E,
        MaschineButton.GROUP_F,
        MaschineButton.GROUP_G,
        MaschineButton.GROUP_H,

        // Transport
        MaschineButton.RESTART,
        MaschineButton.METRO,
        MaschineButton.EVENTS,
        MaschineButton.GRID,
        MaschineButton.PLAY,
        MaschineButton.REC,
        MaschineButton.ERASE,
        MaschineButton.SHIFT, // Abstract

        // Pads
        MaschineButton.SCENE,
        MaschineButton.PATTERN,
        MaschineButton.PAD_MODE,
        MaschineButton.NAVIGATE,
        MaschineButton.DUPLICATE,
        MaschineButton.SELECT,
        MaschineButton.SOLO,
        MaschineButton.MUTE,

        // Edit
        MaschineButton.COPY,
        MaschineButton.PASTE,
        MaschineButton.NOTE,
        MaschineButton.NUDGE,
        MaschineButton.UNDO,
        MaschineButton.REDO,
        MaschineButton.QUANTIZE,
        MaschineButton.CLEAR,

        // Navigate
        MaschineButton.JOG_WHEEL,
        MaschineButton.BACK,
        MaschineButton.LEFT_ARROW,
        MaschineButton.RIGHT_ARROW,
        MaschineButton.ENTER // Abstract SHIFT
    ];

    AbstractControlSurface.call (this, output, input, buttons);

    this.shiftButtonId = MaschineButton.SHIFT;
    this.selectButtonId = MaschineButton.SELECT;

    for (var i = 36; i < 52; i++)
        this.gridNotes.push (i);

    this.pads = new Grid (output);
    this.display = new Display(output);

    this.display.clear ().allDone ();
}

MaschineStudio.prototype = new AbstractControlSurface ();


MaschineStudio.prototype.shutdown = function ()
{
    // Clear display
    for (var i = 0; i < 2; i++)
        this.display.clearRow (i);
//
//    // Turn off all buttons
//    for (var i = 0; i < this.buttons.length; i++)
//        this.setButton (this.buttons[i], PUSH_BUTTON_STATE_OFF);
//
//    // Turn off 1st/2nd row buttons
//    for (var i = 20; i < 27; i++)
//        this.setButton (i, PUSH_BUTTON_STATE_OFF);
//    for (var i = 102; i < 110; i++)
//        this.setButton (i, PUSH_BUTTON_STATE_OFF);

    this.pads.turnOff ();
};

//--------------------------------------
// Display
//--------------------------------------

MaschineStudio.prototype.setButton = function (button, state)
{
    //println(button + ", " + state);
    this.output.sendCC (button, state);
};

MaschineStudio.prototype.sendColor = function (channel, color)
{
    var hue = Math.floor (color.hue * 127.0 / 360.0);
    var saturation = Math.floor ((1 - Math.pow (1 - color.saturation, 2)) * 127.0);
    var brightness = Math.floor (color.brightness * 127.0);
    //println("send " + i + ", " + hue + ", " + saturation + ", " + brightness);

    this.sendCCEx (0, channel, hue);
    this.sendCCEx (1, channel, saturation);
    this.sendCCEx (2, channel, brightness);
};

MaschineStudio.prototype.sendCCEx = function (channel, cc, value)
{
    host.getMidiOutPort (0).sendMidi (0xB0 | channel, cc, value);
};

//--------------------------------------
// Handlers
//--------------------------------------

MaschineStudio.prototype.handleMidi = function (status, data1, data2)
{
    this.currentChannel = MIDIChannel (status);
    // MaschineStudio.handleMidi()176, , 16, 65
    //println("MaschineStudio.handleMidi()" + status + ", " + data1 + ", " + data2);
    AbstractControlSurface.prototype.handleMidi.call (this, status, data1, data2);
};

MaschineStudio.prototype.getCurrentChannel = function ()
{
    return this.currentChannel;
};

MaschineStudio.prototype.handleEvent = function (cc, value) {

    var view = this.getActiveView ();
    if (view == null)
        return;

//    if (!this.isActiveMode (this.currentChannel))
//    {
//        this.setActiveMode (this.currentChannel);
//        this.scheduledFlush ();
//        host.showPopupNotification("Mode changed: " + this.currentChannel);
//    }

    //println("handleEvent() " + this.currentChannel);
    var event = this.isButton(cc) ? new ButtonEvent(this.buttonStates[cc]) : null;

    switch (cc) {

        case MaschineButton.CHANNEL:
            view.onChannel (event);
            break;

        case MaschineButton.PLUGIN:
            view.onPlugin (event);
            break;

        case MaschineButton.ARRANGE:
            view.onArrange (event);
            break;

        case MaschineButton.MIX:
            view.onMix (event);
            break;

        case MaschineButton.BROWSE:
            view.onBrowse (event);
            break;

        case MaschineButton.SAMPLING:
            view.onSampling (event);
            break;

        case MaschineButton.ALL:
            view.onAll (event);
            break;

        case MaschineButton.AUTO:
            view.onAuto (event);
            break;

        // Top Row Buttons
        case MaschineButton.TOP_ROW_0:
        case MaschineButton.TOP_ROW_1:
        case MaschineButton.TOP_ROW_2:
        case MaschineButton.TOP_ROW_3:
        case MaschineButton.TOP_ROW_4:
        case MaschineButton.TOP_ROW_5:
        case MaschineButton.TOP_ROW_6:
        case MaschineButton.TOP_ROW_7:
            view.onFirstRow (event, cc - MaschineButton.TOP_ROW_0);
            break;

        // Encoders
        case MaschineButton.ENCODER_1:
        case MaschineButton.ENCODER_2:
        case MaschineButton.ENCODER_3:
        case MaschineButton.ENCODER_4:
        case MaschineButton.ENCODER_5:
        case MaschineButton.ENCODER_6:
        case MaschineButton.ENCODER_7:
        case MaschineButton.ENCODER_8:
            view.onValueKnob (cc - MaschineButton.ENCODER_1, value);
            break;

        // Master
        case MaschineButton.IN1:
            view.onIn1 (event);
            break;

        case MaschineButton.IN2:
            view.onIn2 (event);
            break;

        case MaschineButton.IN3:
            view.onIn3 (event);
            break;

        case MaschineButton.IN4:
            view.onIn4 (event);
            break;

        case MaschineButton.ENCODER_LARGE:
            view.onEncoderLarge (value == 0 ? 0 : -1);
            break;

        case MaschineButton.MST:
            view.onMst (event);
            break;

        case MaschineButton.GRP:
            view.onGrp (event);
            break;

        case MaschineButton.SND:
            view.onSnd (event);
            break;

        case MaschineButton.CUE:
            view.onCue (event);
            break;

        // Performance
        case MaschineButton.TAP:
            view.onTap (event);
            break;

        case MaschineButton.STEP_MODE:
            view.onStepMode (event);
            break;

        case MaschineButton.MACRO:
            view.onMacro (event);
            break;

        case MaschineButton.NOTE_REPEAT:
            view.onNoteRepeat (event);
            break;

        // Groups
        case MaschineButton.GROUP_A:
        case MaschineButton.GROUP_B:
        case MaschineButton.GROUP_C:
        case MaschineButton.GROUP_D:
        case MaschineButton.GROUP_E:
        case MaschineButton.GROUP_F:
        case MaschineButton.GROUP_G:
        case MaschineButton.GROUP_H:
            view.onGoupButton (event, cc - MaschineButton.GROUP_A);
            break;

        // Transport
        case MaschineButton.RESTART:
            view.onRestart (event);
            break;

        case MaschineButton.METRO:
            view.onMetro (event);
            break;

        case MaschineButton.EVENTS:
            view.onEvents (event);
            break;

        case MaschineButton.GRID:
            view.onGrid (event);
            break;

        case MaschineButton.PLAY:
            view.onPlay (event);
            break;

        case MaschineButton.REC:
            view.onRec (event);
            break;

        case MaschineButton.ERASE:
            view.onErase (event);
            break;

        // Pads
        case MaschineButton.SCENE:
            view.onScene (event);
            break;

        case MaschineButton.PATTERN:
            view.onPattern (event);
            break;

        case MaschineButton.PAD_MODE:
            view.onPadMode (event);
            break;

        case MaschineButton.NAVIGATE:
            view.onNavigate (event);
            break;

        case MaschineButton.DUPLICATE:
            view.onDuplicate (event);
            break;

        case MaschineButton.SELECT:
            view.onSelect (event);
            break;

        case MaschineButton.SOLO:
            view.onSolo (event);
            break;

        case MaschineButton.MUTE:
            view.onMute (event);
            break;

        // Edit
        case MaschineButton.COPY:
            view.onCopy (event);
            break;

        case MaschineButton.PASTE:
            view.onPaste (event);
            break;

        case MaschineButton.NOTE:
            view.onNote (event);
            break;

        case MaschineButton.NUDGE:
            view.onNudge (event);
            break;

        case MaschineButton.UNDO:
            view.onUndo (event);
            break;

        case MaschineButton.REDO:
            view.onRedo (event);
            break;

        case MaschineButton.QUANTIZE:
            view.onQuantize (event);
            break;

        case MaschineButton.CLEAR:
            view.onClear (event);
            break;

        case MaschineButton.JOG_WHEEL:
            view.onJogWheel (event, value == 1);
            break;

        case MaschineButton.BACK:
            view.onBack (event);
            break;

        case MaschineButton.LEFT_ARROW:
            view.onLeftArrow (event);
            break;

        case MaschineButton.RIGHT_ARROW:
            view.onRightArrow (event);
            break;

        case MaschineButton.ENTER:
        case MaschineButton.SHIFT:
            view.onShift (event);
            break;

        default:
            println (cc);
            break;
    }
};

//    this.display.setRow(0, "Foo bar 1");
//    this.display.setRow(1, "Foo bar 2");
//    this.display.setRow(2, "Foo bar 3");
//    this.display.setRow(3, "Foo bar 4");

//    this.display
//        .setCell(0, 0, "0123456789")
//        .setCell(0, 1, "0123456789")
//        .setCell(0, 2, "0123456789")
//        .setCell(0, 3, "0123456789")
//        .allDone();
