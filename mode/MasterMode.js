// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

MasterMode.PARAM_NAMES = 'Volume   Pan                                                        ';

function MasterMode (model, isTemporary)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_MASTER;
    this.isTemporary = false;
}
MasterMode.prototype = new BaseMode ();

MasterMode.prototype.onValueKnob = function (index, value)
{
    if (index == 0)
        this.model.getMasterTrack ().changeVolume (value, this.surface.getFractionValue ());
    else if (index == 1)
        this.model.getMasterTrack ().changePan (value, this.surface.getFractionValue ());
};
//
//MasterMode.prototype.onValueKnobTouch = function (index, isTouched)
//{
//    if (isTouched && this.surface.isDeletePressed ())
//    {
//        this.surface.setButtonConsumed (PUSH_BUTTON_DELETE);
//        if (index == 0)
//            this.model.getMasterTrack ().resetVolume ();
//        else if (index == 1)
//            this.model.getMasterTrack ().resetPan ();
//    }
//};

MasterMode.prototype.onFirstRow = function (index) {};

MasterMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    var master = this.model.getMasterTrack ();
    
    d.setRow (0, MasterMode.PARAM_NAMES)
     .setCell (1, 0, master.getVolumeString (), Display.FORMAT_RAW)
     .setCell (1, 1, master.getPanString (), Display.FORMAT_RAW)
     .clearCell (1, 2).clearCell (1, 3).clearCell (1, 4).clearCell (1, 5)
     .clearCell (1, 6).clearCell (1, 7).done (1)
    
     .setCell (2, 0, this.surface.showVU ? master.getVU () : master.getVolume (), Display.FORMAT_VALUE)
     .setCell (2, 1, master.getPan (), Display.FORMAT_PAN)
     .clearCell (2, 2).clearCell (2, 3).clearCell (2, 4).clearCell (2, 5)
     .clearCell (2, 6).clearCell (2, 7).done (2);
    
//     .setCell (3, 0, master.getName (), Display.FORMAT_RAW)
//     .clearCell (3, 1).clearCell (3, 2).clearCell (3, 3).clearCell (3, 4).clearCell (3, 5)
//     .clearCell (3, 6).clearCell (3, 7).done (3);
};

//MasterMode.prototype.updateFirstRow = function ()
//{
//    for (var i = 0; i < 8; i++)
//        this.surface.setButton (20 + i, PUSH_COLOR_BLACK);
//};
//
//MasterMode.prototype.updateSecondRow = function ()
//{
//    for (var i = 0; i < 8; i++)
//        this.surface.setButton (102 + i, PUSH_COLOR2_BLACK);
//};
