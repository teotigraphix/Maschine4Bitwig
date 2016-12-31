// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// array of cc numbers that are used in the
var MASCHINE_MK1_BUTTONS = [

    MaschineButton.JOG_WHEEL,
    MaschineButton.JOG_WHEEL_PUSH,
    MaschineMK1Button.JOG2,
    MaschineMK1Button.JOG3,

    // Controller
    MaschineMK2Button.CONTROL, // CHANNEL (MIDI)
    MaschineMK2Button.STEP,  // PLUGIN (INSTANCE)
    MaschineButton.BROWSE,
    MaschineButton.SAMPLING,

    // Knob buttons
    MaschineButton.ALL,  // (MK1 SNAP)
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

    // TODO Master Knobs

    MaschineButton.NOTE_REPEAT, // (TAP)

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
    MaschineButton.LEFT_ARROW, // < STEP
    MaschineButton.RIGHT_ARROW, // STEP >
    MaschineButton.GRID, // (REC MODE)

    MaschineButton.PLAY,
    MaschineButton.REC,  // (COUNT-IN)
    MaschineButton.ERASE,

    // Pads
    MaschineButton.SCENE,
    MaschineButton.PATTERN,
    MaschineButton.PAD_MODE, // (KEYBOARD)
    MaschineButton.NAVIGATE, // (MIX)
    MaschineButton.DUPLICATE,
    MaschineButton.SELECT, // (EVENTS)
    MaschineButton.SOLO,
    MaschineButton.MUTE // (CHOKE)
];

function MaschineMK1 (output, input)
{
    Maschine.call (this, output, input, MASCHINE_MK1_BUTTONS);

    this.shiftButtonId = MaschineButton.GROUP_A;
    this.selectButtonId = MaschineButton.SELECT;

    this.pads = new Grid (output);
    this.display = new Display(output);
    this.display.clear ().allDone ();
}

MaschineMK1.prototype = new Maschine ();

//--------------------------------------
// Handlers
//--------------------------------------

MaschineMK1.prototype.handleEvent = function (cc, value)
{
    var view = this.getActiveView ();
    if (view == null)
        return;

    var event = this.isButton (cc) ? new ButtonEvent (this.buttonStates[cc]) : null;

    switch (cc)
    {
        case MaschineMK2Button.CONTROL: // CHANNEL
            view.onControl (event);
            break;

        case MaschineMK2Button.STEP: // PLUGIN-IN
            view.onStepMode (event);
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

        case MaschineButton.JOG_WHEEL:
            if (value != 127)
                view.onJogWheel (value == 2);
            break;

        case MaschineMK1Button.JOG2:
            if (value >= 64)
                value -= 128;
            println(value);
            view.onJogWheel2 (value);
            break;

        case MaschineMK1Button.JOG3:
            if (value != 127)
                view.onJogWheel3 (value == 2);
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

        case MaschineButton.NOTE_REPEAT: // TAP
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
}
