// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

FrameMode.ROW0 = 'NtEdit  Auto  Device  Mixer                            ';
FrameMode.ROW1 = '                                                       ';

//FrameMode.ROW0 = 'Arange Mix    Edit   NotEdt Auto   Device Mixer  Full  ';
//FrameMode.ROW1 = 'Markrs Follow TrckHt ClpLch XFade  FX     I/O    Meters';
//FrameMode.BUTTON_COLOR_OFF  = PUSH_COLOR_GREEN_LO;
//FrameMode.BUTTON_COLOR_ON   = PUSH_COLOR_YELLOW_MD;
//FrameMode.BUTTON_COLOR2_OFF = PUSH_COLOR2_GREEN_LO;
//FrameMode.BUTTON_COLOR2_ON  = PUSH_COLOR2_YELLOW_HI;


function FrameMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_FRAME;
    this.isTemporary = true;
    this.bottomItems = [];
}
FrameMode.prototype = new BaseMode ();

FrameMode.prototype.onFirstRow = function (index) 
{
    var app = this.model.getApplication ();
    switch (index)
    {
        case 0: app.toggleNoteEditor (); break;
        case 1: app.toggleAutomationEditor (); break;
        case 2: app.toggleDevices (); break;
        case 3: app.toggleMixer (); break;
    }
};

//FrameMode.prototype.onSecondRow = function (index)
//{
//    var arrange = this.model.getArranger ();
//    var mix = this.model.getMixer ();
//    switch (index)
//    {
//        case 0: arrange.toggleCueMarkerVisibility (); break;
//        case 1: arrange.togglePlaybackFollow (); break;
//        case 2: arrange.toggleTrackRowHeight (); break;
//        case 3: mix.toggleClipLauncherSectionVisibility (); break;
//        case 4: mix.toggleCrossFadeSectionVisibility (); break;
//        case 5:
//            var toggleBoth = mix.isDeviceSectionVisible () == mix.isSendSectionVisible ();
//            mix.toggleDeviceSectionVisibility ();
//            if (toggleBoth)
//                mix.toggleSendsSectionVisibility ();
//            break;
//        case 6: mix.toggleIoSectionVisibility (); break;
//        case 7: mix.toggleMeterSectionVisibility (); break;
//    }
//};

FrameMode.prototype.updateDisplay = function () 
{
    this.surface.getDisplay ().setRow (0, FrameMode.ROW0).setRow (1, FrameMode.ROW1);
};

//FrameMode.prototype.updateFirstRow = function ()
//{
//    var app = this.model.getApplication ();
//    var layout = app.getPanelLayout ();
//    this.surface.setButton (20, layout == 'ARRANGE' ? FrameMode.BUTTON_COLOR_ON : FrameMode.BUTTON_COLOR_OFF);
//    this.surface.setButton (21, layout == 'MIX' ? FrameMode.BUTTON_COLOR_ON : FrameMode.BUTTON_COLOR_OFF);
//    this.surface.setButton (22, layout == 'EDIT' ? FrameMode.BUTTON_COLOR_ON : FrameMode.BUTTON_COLOR_OFF);
//    this.surface.setButton (23, FrameMode.BUTTON_COLOR_OFF);
//    this.surface.setButton (24, FrameMode.BUTTON_COLOR_OFF);
//    this.surface.setButton (25, FrameMode.BUTTON_COLOR_OFF);
//    this.surface.setButton (26, FrameMode.BUTTON_COLOR_OFF);
//    this.surface.setButton (27, FrameMode.BUTTON_COLOR_OFF);
//};
//
//FrameMode.prototype.updateSecondRow = function ()
//{
//    var arrange = this.model.getArranger ();
//    var mix = this.model.getMixer ();
//    this.surface.setButton (102, arrange.areCueMarkersVisible () ? FrameMode.BUTTON_COLOR2_ON : FrameMode.BUTTON_COLOR2_OFF);
//    this.surface.setButton (103, arrange.isPlaybackFollowEnabled () ? FrameMode.BUTTON_COLOR2_ON : FrameMode.BUTTON_COLOR2_OFF);
//    this.surface.setButton (104, arrange.hasDoubleRowTrackHeight () ? FrameMode.BUTTON_COLOR2_ON : FrameMode.BUTTON_COLOR2_OFF);
//    this.surface.setButton (105, mix.isClipLauncherSectionVisible () ? FrameMode.BUTTON_COLOR2_ON : FrameMode.BUTTON_COLOR2_OFF);
//    this.surface.setButton (106, mix.isCrossFadeSectionVisible () ? FrameMode.BUTTON_COLOR2_ON : FrameMode.BUTTON_COLOR2_OFF);
//    this.surface.setButton (107, mix.isDeviceSectionVisible () ? FrameMode.BUTTON_COLOR2_ON : FrameMode.BUTTON_COLOR2_OFF);
//    this.surface.setButton (108, mix.isIoSectionVisible () ? FrameMode.BUTTON_COLOR2_ON : FrameMode.BUTTON_COLOR2_OFF);
//    this.surface.setButton (109, mix.isMeterSectionVisible () ? FrameMode.BUTTON_COLOR2_ON : FrameMode.BUTTON_COLOR2_OFF);
//};
