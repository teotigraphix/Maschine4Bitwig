// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// array of cc numbers that are used in the
var MASCHINE_MK2_BUTTONS = [

    // Controller
    MaschineMK2Button.CONTROL, // CHANNEL (MIDI)
    MaschineMK2Button.STEP,  // PLUGIN (INSTANCE)
    //MaschineButton.ARRANGE,
    //MaschineButton.MIX,
    MaschineButton.BROWSE,
    MaschineButton.SAMPLING,

    // Knob buttons
    MaschineButton.ALL,  // (SAVE)
    MaschineButton.AUTO,

    // First Row Buttons
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

    // Studio Master
    //MaschineButton.IN1,
    //MaschineButton.IN2,
    //MaschineButton.IN3,
    //MaschineButton.IN4,
    //MaschineButton.MST,
    //MaschineButton.GRP,
    //MaschineButton.SND,
    //MaschineButton.CUE,
    //MaschineButton.ENCODER_LARGE,

    // MK2 Master - Studio Performance
    //MaschineButton.TAP,
    //MaschineButton.STEP_MODE,
    //MaschineButton.MACRO,
    MaschineButton.NOTE_REPEAT, // (TAP)

    // MK2 Specific
    MaschineMK2Button.VOLUME,
    MaschineMK2Button.SWING,
    MaschineMK2Button.TEMPO,
    MaschineButton.ENTER,
    MaschineMK2Button.ARROW_JOG_LEFT,
    MaschineMK2Button.ARROW_JOG_RIGHT,
    MaschineButton.JOG_WHEEL_PUSH,

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
    //MaschineButton.METRO,
    //MaschineButton.EVENTS,
    MaschineButton.GRID, // (REC MODE)
    MaschineButton.PLAY,
    MaschineButton.REC,  // (COUNT-IN)
    MaschineButton.ERASE,
    //MaschineButton.SHIFT, // Abstract

    // MK2 Specific
    MaschineButton.LEFT_ARROW, // < STEP
    MaschineButton.RIGHT_ARROW, // STEP >

    // Pads
    MaschineButton.SCENE,
    MaschineButton.PATTERN,
    MaschineButton.PAD_MODE, // (KEYBOARD)
    MaschineButton.NAVIGATE, // (MIX)
    MaschineButton.DUPLICATE,
    MaschineButton.SELECT, // (EVENTS)
    MaschineButton.SOLO,
    MaschineButton.MUTE // (CHOKE)

    // Edit
    //MaschineButton.COPY,
    //MaschineButton.PASTE,
    //MaschineButton.NOTE,
    //MaschineButton.NUDGE,
    //MaschineButton.UNDO,
    //MaschineButton.REDO,
    //MaschineButton.QUANTIZE,
    //MaschineButton.CLEAR,

    // Navigate
    //MaschineButton.JOG_WHEEL,
    //MaschineButton.BACK,
    //MaschineButton.LEFT_ARROW,
    //MaschineButton.RIGHT_ARROW,
    //MaschineButton.ENTER // Abstract SHIFT
];

function MaschineMK2 (output, input)
{
    Maschine.call (this, output, input, MASCHINE_MK2_BUTTONS);

    this.shiftButtonId = MaschineButton.SHIFT;
    this.selectButtonId = MaschineButton.SELECT;

    this.pads = new Grid (output);
    this.display = new Display(output);
    this.display.clear ().allDone ();
}

MaschineMK2.prototype = new Maschine ();

//--------------------------------------
// Handlers
//--------------------------------------

MaschineMK2.prototype.handleEvent = function (cc, value)
{
    var view = this.getActiveView ();
    if (view == null)
        return;

    var event = this.isButton (cc) ? new ButtonEvent (this.buttonStates[cc]) : null;

    switch (cc)
    {
        case MaschineMK2Button.CONTROL: // CHANNEL
            view.onChannel (event);
            break;

        case MaschineMK2Button.STEP: // PLUGIN-IN
            view.onPlugin (event);
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

        // Master TODO

        case MaschineMK2Button.VOLUME: // TODO add to View
            //view.onVolume (event);
            break;

        case MaschineMK2Button.SWING: // TODO add to View
            //view.onSwing (event);
            break;

        case MaschineMK2Button.TEMPO:
            view.onTempo (event);
            break;

        case MaschineButton.JOG_WHEEL:
            if (value != 127)
                view.onJogWheel (event, value == 2);
            break;

        case MaschineButton.JOG_WHEEL_PUSH:
            //view.onJogWheelPush (event, value);
            break;

        case MaschineButton.NOTE_REPEAT: // TAP
            view.onNoteRepeat (event);
            break;

        case MaschineMK2Button.ARROW_JOG_LEFT: // TODO add to View
            //view.onArrowJogLeft (event);
            break;

        case MaschineMK2Button.ARROW_JOG_RIGHT: // TODO add to View
            //view.onArrowJogRight (event);
            break;

        case MaschineButton.ENTER:
        case MaschineButton.SHIFT:
            view.onShift (event);
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

        case MaschineButton.LEFT_ARROW:
            view.onLeftArrow (event);
            break;

        case MaschineButton.RIGHT_ARROW:
            view.onRightArrow (event);
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

        default:
            println (cc);
            break;
    }
};