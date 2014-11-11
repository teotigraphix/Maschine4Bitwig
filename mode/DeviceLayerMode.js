// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function DeviceLayerMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_BANK_DEVICE;
}
DeviceLayerMode.prototype = new BaseMode ();

DeviceLayerMode.prototype.onValueKnob = function (index, value)
{
    var param = this.model.getCursorDevice ().getFXParam (index);
    param.value = this.surface.changeValue (value, param.value);
    this.model.getCursorDevice ().setParameter (index, param.value);
};

//DeviceLayerMode.prototype.onValueKnobTouch = function (index, isTouched)
//{
//    if (isTouched && this.surface.isDeletePressed ())
//    {
//        this.surface.setButtonConsumed (PUSH_BUTTON_DELETE);
//        this.model.getCursorDevice ().resetParameter (index);
//    }
//};

DeviceLayerMode.prototype.onFirstRow = function (index)
{
    var device = this.model.getCursorDevice ();
    var layer = device.getDeviceLayer (index);
    if (layer.exists)
        device.selectDeviceLayer (layer.index);
};

//DeviceLayerMode.prototype.onSecondRow = function (index)
//{
//    var macro = this.model.getCursorDevice ().getMacro (index);
//    if (macro)
//        macro.getModulationSource ().toggleIsMapping ();
//};

DeviceLayerMode.prototype.updateDisplay = function () 
{
    var d = this.surface.getDisplay ();
    if (this.model.hasSelectedDevice ())
    {
        var cursorDevice = this.model.getCursorDevice ();
        var t = cursorDevice.getSelectedDeviceLayer ();
        d.clear ();
        if (t == null)
        {
            d.setBlock (1, 1, '    Please select').setBlock (1, 2, 'a Device Layer...');
        }
        else
        {
            d.setCell (0, 0, "Volume", Display.FORMAT_RAW);
             
             d.setCell (0, 1, "Pan", Display.FORMAT_RAW);
        }
        
        var selIndex = t == null ? -1 : t.index;
        for (var i = 0; i < 8; i++)
        {
            var layer = cursorDevice.getDeviceLayer (i);
            var isSel = i == selIndex;
            var n = optimizeName (layer.name, isSel ? 7 : 8);
            d.setCell (1, i, isSel ? '>' + n : n, Display.FORMAT_RAW);
        }
    }
    else
        d.setBlock (1, 1, '    Please select').setBlock (1, 2, 'a Device...    ').clearRow (3);
    d.allDone ();
};

DeviceLayerMode.prototype.updateFirstRow = function ()
{
//    var selectedDevice = this.model.getSelectedDevice ();
//    if (this.model.hasSelectedDevice ())
//    {
//        this.surface.setButton (20, PUSH_COLOR_BLACK);
//        this.surface.setButton (21, PUSH_COLOR_BLACK);
//        this.surface.setButton (22, PUSH_COLOR_BLACK);
//        this.surface.setButton (23, PUSH_COLOR_BLACK);
//        this.surface.setButton (24, PUSH_COLOR_BLACK);
//        this.surface.setButton (25, this.model.getCursorDevice ().hasPreviousParameterPage () ? PUSH_COLOR_ORANGE_HI : PUSH_COLOR_BLACK);
//        this.surface.setButton (26, this.model.getCursorDevice ().hasNextParameterPage () ? PUSH_COLOR_ORANGE_HI : PUSH_COLOR_BLACK);
//        this.surface.setButton (27, selectedDevice.enabled ? PUSH_COLOR_GREEN_LO : PUSH_COLOR_BLACK);
//    }
//    else
//    {
//        for (var i = 0; i < 8; i++)
//            this.surface.setButton (20 + i, PUSH_COLOR_BLACK);
//    }
};
//
//DeviceLayerMode.prototype.updateSecondRow = function ()
//{
//    for (var i = 0; i < 8; i++)
//        this.surface.setButton (102 + i, this.model.getCursorDevice().isMacroMapping(i) ? PUSH_COLOR_GREEN_HI_FBLINK : PUSH_COLOR_BLACK);
//};
