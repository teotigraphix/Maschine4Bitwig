
function MaschineStudio ()
{
    ControlSurface.call (this);
    //println("MaschineStudio()");
}

MaschineStudio.prototype = new ControlSurface ();

MaschineStudio.VIEW_GRID = 0;
MaschineStudio.MODE_BANK_DEVICE = 0;

MaschineStudio.prototype.configure = function (config)
{
    ControlSurface.prototype.configure.call (this, config);

    this.setDefaultMode (MODE_DEVICE);

    // add Modes
    this.addMode (MODE_DEVICE, new DeviceMode (this.model));
    this.addMode (MODE_TEST, new TestMode (this.model));

    // add Views
    this.addView (VIEW_PLAY, new PlayViewMS ());

    // set active view & mode
    this.setActiveView (VIEW_PLAY);
    this.setActiveMode (MODE_DEVICE);

    this.updateMode (MODE_DEVICE);
};

MaschineStudio.prototype.onSelectedTrackChanged = function (index, isSelected)
{
    //if (isSelected && this.push.isActiveMode (MODE_MASTER))
    //    this.push.setPendingMode (MODE_TRACK);
    if (this.isActiveView (VIEW_PLAY))
        this.getActiveView ().updateNoteMapping ();
};

MaschineStudio.prototype.updateMode = function (mode)
{
    this.updateIndication (mode);
};

MaschineStudio.prototype.updateIndication = function (mode)
{
    var tb = this.model.getTrackBank ();
    var selectedTrack = tb.getSelectedTrack ();
    for (var i = 0; i < 8; i++)
    {

        var cd = this.model.getCursorDevice ();
        cd.getParameter (i).setIndication (mode == MODE_DEVICE);
        //cd.getCommonParameter (i).setIndication (mode == MODE_BANK_COMMON);
        //cd.getEnvelopeParameter (i).setIndication (mode == MODE_BANK_ENVELOPE);
        //cd.getMacro (i).getAmount ().setIndication (mode == MODE_BANK_MACRO);
    }
};

//--------------------------------------
// Handlers
//--------------------------------------

MaschineStudio.prototype.handleMidi = function (status, data1, data2)
{
    this.currentChannel = MIDIChannel (status);
    //println("MaschineStudio.handleMidi()");
    ControlSurface.prototype.handleMidi.call (this, status, data1, data2);
};

MaschineStudio.prototype.getCurrentChannel = function ()
{
    return this.currentChannel;
};

MaschineStudio.prototype.handleEvent = function (cc, value) {

    var view = this.getActiveView();
    if (view == null)
        return;

    if (!this.isActiveMode (this.currentChannel))
    {
        this.setActiveMode (this.currentChannel);
        this.scheduledFlush ();
        host.showPopupNotification("Mode changed: " + this.currentChannel);
    }


    println("handleEvent() " + this.currentChannel);
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
