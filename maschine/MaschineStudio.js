// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

MaschineStudio.VIEW_PLAY = 0;
MaschineStudio.MODE_BANK_DEVICE = 0;

function MaschineStudio (output, input, buttons)
{
    // array of cc numbers that are used in the
    var buttons = [
        MaschineButton.TOP_ROW_0,
        MaschineButton.TOP_ROW_1,
        MaschineButton.TOP_ROW_2,
        MaschineButton.TOP_ROW_3,
        MaschineButton.TOP_ROW_4,
        MaschineButton.TOP_ROW_5,
        MaschineButton.TOP_ROW_6,
        MaschineButton.TOP_ROW_7,

        MaschineButton.TAP,

        // Encoders
        MaschineButton.ENCODER_1,
        MaschineButton.ENCODER_2,
        MaschineButton.ENCODER_3,
        MaschineButton.ENCODER_4,
        MaschineButton.ENCODER_5,
        MaschineButton.ENCODER_6,
        MaschineButton.ENCODER_7,
        MaschineButton.ENCODER_8,

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
        MaschineButton.PLAY,
        MaschineButton.REC,
        MaschineButton.ERASE,

        // Edit
        MaschineButton.UNDO,
        MaschineButton.REDO,

        // Navigate
        MaschineButton.JOG_WHEEL,
        MaschineButton.LEFT_ARROW,
        MaschineButton.RIGHT_ARROW,
        MaschineButton.ENTER
    ];

    AbstractControlSurface.call (this, output, input, buttons);

    this.shiftButtonId = MaschineButton.SHIFT;
    this.selectButtonId = MaschineButton.SELECT;

    for (var i = 36; i < 52; i++)
        this.gridNotes.push (i);

    this.pads = new Grid (output);
}

MaschineStudio.prototype = new AbstractControlSurface ();

//--------------------------------------
// Display
//--------------------------------------

MaschineStudio.prototype.setButton = function (button, state)
{
    this.output.sendCC (button, state);
};

//--------------------------------------
// Handlers
//--------------------------------------

MaschineStudio.prototype.handleMidi = function (status, data1, data2)
{
    this.currentChannel = MIDIChannel (status);
    //println("MaschineStudio.handleMidi()");
    AbstractControlSurface.prototype.handleMidi.call (this, status, data1, data2);
};

MaschineStudio.prototype.getCurrentChannel = function ()
{
    return this.currentChannel;
};

MaschineStudio.prototype.handleEvent = function (cc, value) {

    var view = this.getActiveView();
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

        // Performance
        case MaschineButton.TAP:
            view.onTap (event);
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

        case MaschineButton.PLAY:
            view.onPlay (event);
            break;

        case MaschineButton.REC:
            view.onRec (event);
            break;

        case MaschineButton.ERASE:
            view.onErase (event);
            break;

        // Edit
        case MaschineButton.UNDO:
            view.onUndo (event);
            break;

        case MaschineButton.REDO:
            view.onRedo (event);
            break;

        case MaschineButton.JOG_WHEEL:
            view.onJogWheel (event, value == 1);
            break;

        case MaschineButton.BACK:
            //view.onBack (event);
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
