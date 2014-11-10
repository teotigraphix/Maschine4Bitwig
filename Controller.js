// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

GlobalConfig.MASTER_TRACK_TEXT_LENGTH  = 6;
GlobalConfig.TRACK_BANK_TEXT_LENGTH    = 13;
GlobalConfig.CURSOR_DEVICE_TEXT_LENGTH = 6;

function Controller (kind)
{
    Config.init ();

    var output = new MidiOutput ();
    var input = new MaschineMidiInput ();
    input.init ();

    this.scales = new Scales(36, 52, 4, 4);
    this.model = new Model (21, this.scales, 8, 4, 4);

    this.model.sessionTrackBank = new TrackBankProxy (4, 4, 4);

    this.model.getTrackBank ().addTrackSelectionListener (doObject (this, function (index, isSelected)
    {
        // if in master mode switch to track when a track is selected
        if (isSelected && this.surface.isActiveMode (Maschine.MODE_MASTER))
            this.surface.setPendingMode (Maschine.MODE_TRACK);
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
    this.surface.addMode (Maschine.MODE_SELECT, new SelectMode (this.model));
    this.surface.addMode (Maschine.MODE_PRESET, new PresetMode (this.model));

    this.surface.addMode (Maschine.MODE_SCALE, new ScalesMode (this.model));
    this.surface.addMode (Maschine.MODE_NAVIGATE, new NavigateMode (this.model));
    this.surface.addMode (Maschine.MODE_TRACK, new TrackMode (this.model));
    this.surface.addMode (Maschine.MODE_VOLUME, new VolumeMode (this.model));
    this.surface.addMode (Maschine.MODE_PAN, new PanMode (this.model));
    this.surface.addMode (Maschine.MODE_SCALE_LAYOUT, new ScaleLayoutMode (this.model));
    this.surface.addMode (Maschine.MODE_CLIP, new ClipMode (this.model));
    this.surface.addMode (Maschine.MODE_XFADE, new CrossFadeMode (this.model));
    this.surface.addMode (Maschine.MODE_MASTER, new MasterMode (this.model));
    this.surface.addMode (Maschine.MODE_GROOVE, new GrooveMode (this.model));
    this.surface.addMode (Maschine.MODE_FRAME, new FrameMode (this.model));
    this.surface.addMode (Maschine.MODE_ACCENT, new AccentMode (this.model));

    this.surface.addMode (Maschine.MODE_SEND1, new SendMode (this.model, Maschine.MODE_SEND1));
    this.surface.addMode (Maschine.MODE_SEND2, new SendMode (this.model, Maschine.MODE_SEND2));
    this.surface.addMode (Maschine.MODE_SEND3, new SendMode (this.model, Maschine.MODE_SEND3));
    this.surface.addMode (Maschine.MODE_SEND4, new SendMode (this.model, Maschine.MODE_SEND4));

    this.surface.addMode (Maschine.MODE_BANK_DEVICE, new DeviceMode (this.model));
    this.surface.addMode (Maschine.MODE_PARAM_PAGE_SELECT, new ParamPageSelectMode (this.model));
//    this.surface.addMode (Maschine.MODE_DEVICE_LAYER, new DeviceLayerMode (this.model));
    this.surface.addMode (Maschine.MODE_BANK_COMMON, new ParamPageMode (this.model, Maschine.MODE_BANK_COMMON, 'Common'));
    this.surface.addMode (Maschine.MODE_BANK_ENVELOPE, new ParamPageMode (this.model, Maschine.MODE_BANK_ENVELOPE, 'Envelope'));
    this.surface.addMode (Maschine.MODE_BANK_DIRECT, new DirectParameterMode (this.model, Maschine.MODE_BANK_DIRECT, 'Direct'));
    this.surface.addMode (Maschine.MODE_BANK_MODULATE, new ParamPageMode (this.model, Maschine.MODE_BANK_MODULATE, 'Modulate'));
    this.surface.addMode (Maschine.MODE_BANK_MACRO, new ParamPageMode (this.model, Maschine.MODE_BANK_MACRO, 'Macro'));
    this.surface.addMode (Maschine.MODE_BANK_USER, new ParamPageMode (this.model, Maschine.MODE_BANK_USER, 'User'));

    // add Views
    this.surface.addView (Maschine.VIEW_PLAY, new PlayView (this.model));
    this.surface.addView (Maschine.VIEW_MODE, new ModeView (this.model));
    this.surface.addView (Maschine.VIEW_DRUM, new DrumView (this.model));
    this.surface.addView (Maschine.VIEW_SESSION, new SceneView (this.model));
    this.surface.addView (Maschine.VIEW_EIDT_TOOLS, new EditToolsView (this.model));
    this.surface.addView (Maschine.VIEW_MUTE, new MuteView (this.model));
    this.surface.addView (Maschine.VIEW_SOLO, new SoloView (this.model));

    this.surface.addViewChangeListener (doObject (this, function (oldViewId, newViewId)
    {
    }));

    this.surface.addModeListener (doObject (this, function (oldMode, newMode)
    {
        this.updateMode (-1);
        this.updateMode (newMode);
    }));

    this.addConfigListeners ();

    // set active view & mode
    this.surface.setActiveView (Maschine.VIEW_PLAY);
    this.surface.setPendingMode (Maschine.MODE_BANK_DEVICE);
}

Controller.prototype = new AbstractController ();

Controller.prototype.flush = function ()
{
    AbstractController.prototype.flush.call (this);
    this.validateViews ();
};

Controller.prototype.validateViews = function ()
{
    for (var i = 0; i < Maschine.VIEW_BUTTONS.length; i++)
    {
        var info = Maschine.VIEW_BUTTONS[i];
        this.surface.setButton (info[1], this.surface.isActiveView (info[0]) ?
            MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);
    }
};

Controller.prototype.updateMode = function (mode)
{
    //println("updateMode() " + mode);
    this.updateIndication (mode);

    // update button lights based on mode
    for (var i = MaschineButton.TOP_ROW_0; i <= MaschineButton.TOP_ROW_7; i++)
        this.surface.setButton (i, MaschineButton.STATE_UP);

    this.surface.setButton (MaschineButton.BROWSE,
        this.surface.isActiveMode(Maschine.MODE_PRESET) ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);

    this.surface.sendColor (MaschineButton.ARROW_LEFT, COLOR.OCEAN);
    this.surface.sendColor (MaschineButton.ARROW_UP, COLOR.OCEAN);
    this.surface.sendColor (MaschineButton.ARROW_RIGHT, COLOR.OCEAN);
    this.surface.sendColor (MaschineButton.ARROW_DOWN, COLOR.OCEAN);
};

Controller.prototype.updateIndication = function (mode)
{
    var isVolume = mode == Maschine.MODE_VOLUME;
    var isPan    = mode == Maschine.MODE_PAN;

    var tb = this.model.getCurrentTrackBank ();
    var selectedTrack = tb.getSelectedTrack ();
    for (var i = 0; i < 8; i++)
    {
        var hasTrackSel = selectedTrack != null && selectedTrack.index == i && mode == Maschine.MODE_TRACK;
        tb.setVolumeIndication (i, isVolume || hasTrackSel);
        tb.setPanIndication (i, isPan || hasTrackSel);
        for (var j = 0; j < 4; j++)
        {
            tb.setSendIndication (i, j,
                    mode == Maschine.MODE_SEND1 && j == 0 ||
                    mode == Maschine.MODE_SEND2 && j == 1 ||
                    mode == Maschine.MODE_SEND3 && j == 2 ||
                    mode == Maschine.MODE_SEND4 && j == 3 ||
                    hasTrackSel
            );
        }

        var cd = this.model.getCursorDevice ();
        cd.getParameter (i).setIndication (mode == Maschine.MODE_BANK_DEVICE);
        cd.getCommonParameter (i).setIndication (mode == Maschine.MODE_BANK_COMMON);
        cd.getEnvelopeParameter (i).setIndication (mode == Maschine.MODE_BANK_ENVELOPE);
        cd.getMacro (i).getAmount ().setIndication (mode == Maschine.MODE_BANK_MACRO);

        var uc = this.model.getUserControlBank ();
        uc.getControl (i).setIndication (mode == Maschine.MODE_BANK_USER);

        var mt = this.model.getMasterTrack ();
        mt.setVolumeIndication (mode == Maschine.MODE_MASTER);
        mt.setPanIndication (mode == Maschine.MODE_MASTER);

        this.model.getGroove ().setIndication (mode == Maschine.MODE_GROOVE);
    }
};

Controller.prototype.addConfigListeners = function ()
{
    Config.addPropertyListener (Config.SCALES_SCALE, doObject (this, function ()
    {
        this.scales.setScaleByName (Config.scale);
        var view = this.surface.getActiveView ();
        if (view != null)
            view.updateNoteMapping ();
    }));
    Config.addPropertyListener (Config.SCALES_BASE, doObject (this, function ()
    {
        this.scales.setScaleOffsetByName (Config.scaleBase);
        var view = this.surface.getActiveView ();
        if (view != null)
            view.updateNoteMapping ();
    }));
    Config.addPropertyListener (Config.SCALES_IN_KEY, doObject (this, function ()
    {
        this.scales.setChromatic (!Config.scaleInKey);
        var view = this.surface.getActiveView ();
        if (view != null)
            view.updateNoteMapping ();
    }));
    Config.addPropertyListener (Config.SCALES_LAYOUT, doObject (this, function ()
    {
        this.scales.setScaleLayoutByName (Config.scaleLayout);
        var view = this.surface.getActiveView ();
        if (view != null)
            view.updateNoteMapping ();
    }));
};

