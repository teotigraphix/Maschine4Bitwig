// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

GlobalConfig.MASTER_TRACK_TEXT_LENGTH  = 6;
GlobalConfig.TRACK_BANK_TEXT_LENGTH    = 6;
GlobalConfig.CURSOR_DEVICE_TEXT_LENGTH = 6;

function Controller (kind)
{
    var output = new MidiOutput ();
    var input = new MaschineMidiInput ();
    input.init ();

    var scales = new Scales(36, 52, 4, 4);
    scales.setChromatic (true);

    this.model = new Model (21, scales, 4, 4, 4);

    this.model.getTrackBank ().addTrackSelectionListener (doObject (this, function (index, isSelected)
    {
        //if (isSelected && this.surface.isActiveMode (MODE_MASTER))
        //    this.surface.setPendingMode (MODE_TRACK);
        if (this.surface.isActiveView (Maschine.VIEW_PLAY))
            this.surface.getActiveView ().updateNoteMapping ();
    }));

    if (kind == Maschine.STUDIO)
    {
        this.surface = new MaschineStudio (output, input);
    }
    else if (kind == Maschine.MK2)
    {
        this.surface = new MaschineMK2 (output, input);
    }
    else if (kind == Maschine.MIKROMK2)
    {
        this.surface = new MaschineMikroMK2 (output, input);
    }
    else if (kind == Maschine.MK1)
    {
        this.surface = new MaschineMK1 (output, input);
    }
	
    this.surface.setDefaultMode (Maschine.MODE_BANK_DEVICE);

    // add Modes
    this.surface.addMode (Maschine.MODE_BANK_DEVICE, new DeviceMode (this.model));
    this.surface.addMode (Maschine.MODE_SCALE, new ScalesMode (this.model));
    this.surface.addMode (Maschine.MODE_NAVIGATE, new NavigateMode (this.model));

//    this.surface.addMode (MODE_BANK_DEVICE, new DeviceMode (this.model));
//    this.surface.addMode (MODE_DEVICE_LAYER, new DeviceLayerMode (this.model));
//    this.surface.addMode (MODE_BANK_COMMON, new ParamPageMode (this.model, MODE_BANK_COMMON, 'Common'));
//    this.surface.addMode (MODE_BANK_ENVELOPE, new ParamPageMode (this.model, MODE_BANK_ENVELOPE, 'Envelope'));
//    this.surface.addMode (MODE_BANK_DIRECT, new DirectParameterMode (this.model, MODE_BANK_DIRECT, 'Direct'));
//    this.surface.addMode (MODE_BANK_MODULATE, new ParamPageMode (this.model, MODE_BANK_MODULATE, 'Modulate'));
//    this.surface.addMode (MODE_BANK_MACRO, new ParamPageMode (this.model, MODE_BANK_MACRO, 'Macro'));
//    this.surface.addMode (MODE_BANK_USER, new ParamPageMode (this.model, MODE_BANK_USER, 'User'));

    // add Views
    this.surface.addView (Maschine.VIEW_PLAY, new PlayViewMS (this.model));
    this.surface.addView (Maschine.VIEW_DRUM, new DrumView (this.model));
    this.surface.addView (Maschine.VIEW_SESSION, new SessionViewMS (this.model));
    this.surface.addView (Maschine.VIEW_EIDT_TOOLS, new EditToolsView (this.model));


    this.surface.addModeListener (doObject (this, function (oldMode, newMode)
    {
        this.updateMode (-1);
        this.updateMode (newMode);
    }));

    // set active view & mode
    this.surface.setActiveView (Maschine.VIEW_PLAY);
    this.surface.setActiveMode (Maschine.MODE_BANK_DEVICE);

    this.updateMode (Maschine.MODE_BANK_DEVICE);
}

Controller.prototype = new AbstractController ();

Controller.prototype.flush = function ()
{
    AbstractController.prototype.flush.call (this);

    this.surface.sendColor(MaschineButton.ARROW_LEFT, COLOR.OCEAN);
    this.surface.sendColor(MaschineButton.ARROW_UP, COLOR.OCEAN);
    this.surface.sendColor(MaschineButton.ARROW_RIGHT, COLOR.OCEAN);
    this.surface.sendColor(MaschineButton.ARROW_DOWN, COLOR.OCEAN);

    if (this.model.hasSelectedDevice ())
    {
        var selectedDevice = this.model.getSelectedDevice();
        this.surface.setButton (MaschineButton.TOP_ROW_7, selectedDevice.enabled ? 127 : 0);
    }
};

Controller.prototype.updateMode = function (mode)
{
    this.updateIndication (mode);

    // update button lights based on mode
};

Controller.prototype.updateIndication = function (mode)
{
//    var isVolume = mode == MODE_VOLUME;
//    var isPan    = mode == MODE_PAN;
//
    var tb = this.model.getCurrentTrackBank ();
    var selectedTrack = tb.getSelectedTrack ();
    for (var i = 0; i < 8; i++)
    {
//        var hasTrackSel = selectedTrack != null && selectedTrack.index == i && mode == MODE_TRACK;
//        tb.setVolumeIndication (i, isVolume || hasTrackSel);
//        tb.setPanIndication (i, isPan || hasTrackSel);
//        for (var j = 0; j < 6; j++)
//        {
//            tb.setSendIndication (i, j,
//                    mode == MODE_SEND1 && j == 0 ||
//                    mode == MODE_SEND2 && j == 1 ||
//                    mode == MODE_SEND3 && j == 2 ||
//                    mode == MODE_SEND4 && j == 3 ||
//                    mode == MODE_SEND5 && j == 4 ||
//                    mode == MODE_SEND6 && j == 5 ||
//                    hasTrackSel
//            );
//        }
//
        var cd = this.model.getCursorDevice ();
        cd.getParameter (i).setIndication (mode == Maschine.MODE_BANK_DEVICE);
//        cd.getCommonParameter (i).setIndication (mode == MODE_BANK_COMMON);
//        cd.getEnvelopeParameter (i).setIndication (mode == MODE_BANK_ENVELOPE);
//        cd.getMacro (i).getAmount ().setIndication (mode == MODE_BANK_MACRO);
//
//        var uc = this.model.getUserControlBank ();
//        uc.getControl (i).setIndication (mode == MODE_BANK_USER);
//
//        var mt = this.model.getMasterTrack ();
//        mt.setVolumeIndication (mode == MODE_MASTER);
//        mt.setPanIndication (mode == MODE_MASTER);
//
//        this.model.getGroove ().setIndication (mode == MODE_GROOVE);
    }
};
