// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function Controller ()
{
    var output = new MidiOutput ();
    var input = new MaschineMidiInput ();
    input.init ();

    var scales = new Scales(36, 52, 4, 4);
    scales.setChromatic (true);

    this.model = new Model (21, scales);
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
    //this.addMode (MODE_DEVICE, new DeviceMode (this.model));

    // add Views
    this.surface.addView (MaschineStudio.VIEW_PLAY, new PlayViewMS (this.model));

    // set active view & mode
    this.surface.setActiveView (MaschineStudio.VIEW_PLAY);
    this.surface.setActiveMode (MaschineStudio.MODE_BANK_DEVICE);

    //this.surface.updateMode (MODE_DEVICE);
}

Controller.prototype = new AbstractController ();

Controller.prototype.flush = function ()
{
    AbstractController.prototype.flush.call (this);


};