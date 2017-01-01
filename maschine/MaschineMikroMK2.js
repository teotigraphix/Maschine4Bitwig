// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// array of cc numbers that are used in the
var MASCHINE_MIKRO_MK2_BUTTONS = [

    MaschineMikroMK2Button.F1,
    MaschineMikroMK2Button.F2,
    MaschineMikroMK2Button.F3,

    MaschineButton.JOG_WHEEL_PUSH,

    // Controller
    MaschineMikroMK2Button.CONTROL, // CHANNEL (MIDI)

    MaschineMikroMK2Button.MAIN,

    MaschineMikroMK2Button.GROUP,
    MaschineButton.BROWSE,
    MaschineButton.SAMPLING,
    MaschineButton.NOTE_REPEAT,

    MaschineButton.RESTART,
    MaschineButton.LEFT_ARROW,
    MaschineButton.RIGHT_ARROW,
    MaschineButton.GRID,

    MaschineButton.PLAY,
    MaschineButton.REC,
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

function MaschineMikroMK2 (output, input)
{
    Maschine.call (this, output, input, MASCHINE_MIKRO_MK2_BUTTONS);

    this.shiftButtonId = MaschineButton.SHIFT;
    this.selectButtonId = MaschineButton.SELECT;
    this.ctrlButtonId = MaschineMikroMK2.CONTROL;

    this.pads = new Grid (output);
    this.display = new Display (output);
    this.display.clear ().allDone ();
}

MaschineMikroMK2.prototype = new Maschine ();

//--------------------------------------
// Handlers
//--------------------------------------

// TODO Missing onStepMode()

MaschineMikroMK2.prototype.handleEvent = function (cc, value)
{
    var view = this.getActiveView ();
    if (view == null)
        return;

    var event = this.isButton (cc) ? new ButtonEvent (this.buttonStates[cc]) : null;

    switch (cc)
    {
        case MaschineMikroMK2Button.F1:
        case MaschineMikroMK2Button.F2:
        case MaschineMikroMK2Button.F3:
            if (event.isDown())
                view.onFirstRow (cc - MaschineMikroMK2Button.F1);
            break;

        case MaschineMikroMK2Button.CONTROL: // CHANNEL
            view.onControl (event);
            break;

        case MaschineButton.JOG_WHEEL:
            if (value != 127)
                view.onJogWheel (value == 2);
            break;

        case MaschineButton.JOG_WHEEL_PUSH:
            //view.onJogWheelPush (event, value);
            break;

        case MaschineMikroMK2Button.MAIN:
            //view.onMain (event); // Shift
            break;

        case MaschineMikroMK2Button.GROUP:
            //view.onGroup (event);
            break;

        case MaschineButton.BROWSE:
            view.onBrowse (event);
            break;

        case MaschineButton.SAMPLING:
            view.onSampling (event);
            break;

        case MaschineButton.NOTE_REPEAT: // TAP
            view.onNoteRepeat (event);
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
