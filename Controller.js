// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt


var MODE_DEVICE = 0;

function Controller ()
{
    var output = new MidiOutput ();
    var input = new MaschineMidiInput ();
    input.init ();

    var scales = new Scales(36, 52, 4, 4);
    //scales.setChromatic (true);

    this.model = new Model (21, scales, 4, 4, 4);
    this.model.getTrackBank ().addTrackSelectionListener (doObject (this, function (index, isSelected)
    {
        //if (isSelected && this.surface.isActiveMode (MODE_MASTER))
        //    this.surface.setPendingMode (MODE_TRACK);
        if (this.surface.isActiveView (MaschineStudio.VIEW_PLAY))
            this.surface.getActiveView ().updateNoteMapping ();
    }));

    this.surface = new MaschineStudio (output, input);
    this.surface.setDefaultMode (MaschineStudio.MODE_BANK_DEVICE);

    // add Modes
    this.surface.addMode (MaschineStudio.MODE_BANK_DEVICE, new DeviceMode (this.model));

    // add Views
    this.surface.addView (MaschineStudio.VIEW_PLAY, new PlayViewMS (this.model));
    //this.surface.addView (MaschineStudio.VIEW_DRUM, new DrumView (this.model));
    this.surface.addView (MaschineStudio.VIEW_SESSION, new SessionViewMS (this.model));

    this.surface.addModeListener (doObject (this, function (oldMode, newMode)
    {
        this.updateMode (-1);
        this.updateMode (newMode);
    }));

    // set active view & mode
    this.surface.setActiveView (MaschineStudio.VIEW_PLAY);
    this.surface.setActiveMode (MaschineStudio.MODE_BANK_DEVICE);
}

Controller.prototype = new AbstractController ();

Controller.prototype.flush = function ()
{
    AbstractController.prototype.flush.call (this);
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
//    var tb = this.model.getCurrentTrackBank ();
//    var selectedTrack = tb.getSelectedTrack ();
//    for (var i = 0; i < 8; i++)
//    {
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
//        var cd = this.model.getCursorDevice ();
//        cd.getParameter (i).setIndication (mode == MODE_BANK_DEVICE);
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
//    }
};