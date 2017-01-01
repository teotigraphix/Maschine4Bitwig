// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// array of cc numbers that are used in the
var MASCHINE_STUDIO_BUTTONS = [
    // Controller
    MaschineButton.CHANNEL, // (MIDI)
    MaschineButton.PLUGIN, // (INSTANCE)
    MaschineButton.ARRANGE,
    MaschineButton.MIX,
    MaschineButton.BROWSE,
    MaschineButton.SAMPLING,

    // Knob buttons
    MaschineButton.ALL,
    MaschineButton.AUTO, // (SAVE)

    // First Row Buttons
    MaschineButton.TOP_ROW_0,
    MaschineButton.TOP_ROW_1,
    MaschineButton.TOP_ROW_2,
    MaschineButton.TOP_ROW_3,
    MaschineButton.TOP_ROW_4,
    MaschineButton.TOP_ROW_5,
    MaschineButton.TOP_ROW_6,
    MaschineButton.TOP_ROW_7,

    MaschineStudioButton.ENCODER_1_TOUCH,
    MaschineStudioButton.ENCODER_2_TOUCH,
    MaschineStudioButton.ENCODER_3_TOUCH,
    MaschineStudioButton.ENCODER_4_TOUCH,
    MaschineStudioButton.ENCODER_5_TOUCH,
    MaschineStudioButton.ENCODER_6_TOUCH,
    MaschineStudioButton.ENCODER_7_TOUCH,
    MaschineStudioButton.ENCODER_8_TOUCH,

    // Master
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
    MaschineButton.RESTART, // (LOOP)
    MaschineButton.METRO,
    MaschineButton.EVENTS,
    MaschineButton.GRID,  // (REC MODE)
    MaschineButton.PLAY,
    MaschineButton.REC, // (COUNT-IN)
    MaschineButton.ERASE,
    MaschineButton.SHIFT, // Abstract

    // Pads
    MaschineButton.SCENE,
    MaschineButton.PATTERN,
    MaschineButton.PAD_MODE,  // (KEYBOARD)
    MaschineButton.NAVIGATE,
    MaschineButton.DUPLICATE,
    MaschineButton.SELECT,
    MaschineButton.SOLO,
    MaschineButton.MUTE, // (CHOKE)

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
    MaschineButton.JOG_WHEEL_PUSH,
    MaschineButton.BACK,
    MaschineButton.LEFT_ARROW,
    MaschineButton.RIGHT_ARROW,
    MaschineButton.ENTER // Abstract SHIFT
];

function MaschineStudio (output, input)
{
    Maschine.call (this, output, input, MASCHINE_STUDIO_BUTTONS);

    this.shiftButtonId = MaschineButton.SHIFT;
    this.selectButtonId = MaschineButton.SELECT;

    this.pads = new Grid (output);
    this.display = new Display (output);
    this.display.clear ().allDone ();
}

MaschineStudio.prototype = new Maschine ();

//--------------------------------------
// Handlers
//--------------------------------------

MaschineStudio.prototype.handleEvent = function (cc, value)
{
    var view = this.getActiveView ();
    if (view == null)
        return;

    var event = this.isButton (cc) ? new ButtonEvent (this.buttonStates[cc]) : null;

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

        // First Row Buttons
        case MaschineButton.TOP_ROW_0:
        case MaschineButton.TOP_ROW_1:
        case MaschineButton.TOP_ROW_2:
        case MaschineButton.TOP_ROW_3:
        case MaschineButton.TOP_ROW_4:
        case MaschineButton.TOP_ROW_5:
        case MaschineButton.TOP_ROW_6:
        case MaschineButton.TOP_ROW_7:
            if (event.isDown())
                view.onFirstRow (cc - MaschineButton.TOP_ROW_0);
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

        case MaschineStudioButton.ENCODER_1_TOUCH:
        case MaschineStudioButton.ENCODER_2_TOUCH:
        case MaschineStudioButton.ENCODER_3_TOUCH:
        case MaschineStudioButton.ENCODER_4_TOUCH:
        case MaschineStudioButton.ENCODER_5_TOUCH:
        case MaschineStudioButton.ENCODER_6_TOUCH:
        case MaschineStudioButton.ENCODER_7_TOUCH:
        case MaschineStudioButton.ENCODER_8_TOUCH:
            view.onValueKnobTouch (cc - 100, value == MaschineButton.STATE_DOWN);
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
            if (value != 127)
                view.onJogWheel (value == 2);
            break;

        case MaschineButton.JOG_WHEEL_PUSH:
            view.onJogWheelPush (event, value);
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
