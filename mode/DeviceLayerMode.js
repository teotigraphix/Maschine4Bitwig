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
    var cd = this.model.getCursorDevice ();
    var selectedDeviceLayer = cd.getSelectedLayer ();
    if (selectedDeviceLayer == null)
        return;
    switch (index)
    {
        case 0:
            cd.changeLayerVolume (selectedDeviceLayer.index, value, this.surface.getFractionValue ());
            break;
        case 1:
            cd.changeLayerPan (selectedDeviceLayer.index, value, this.surface.getFractionValue ());
            break;
    }
};

DeviceLayerMode.prototype.onFirstRow = function (index)
{
    var cd = this.model.getCursorDevice ();
    var layer = cd.getLayer (index);
    if (layer.exists)
        cd.selectLayer (layer.index);
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
        var t = cursorDevice.getSelectedLayer ();
        d.clear ();
        if (t == null)
        {
            d.setBlock (1, 1, '    Please select').setBlock (1, 2, 'a Device Layer...');
        }
        else
        {
            //d.setCell (0, 0, "Volume", Display.FORMAT_RAW)
                d.setCell (1, 0, t.volumeStr, Display.FORMAT_RAW)
            //    .setCell (0, 1, "Pan", Display.FORMAT_RAW)
                .setCell (1, 1, t.panStr, Display.FORMAT_RAW);
        }

        var selIndex = t == null ? -1 : t.index;
        for (var i = 0; i < 8; i++)
        {
            var layer = cursorDevice.getLayer (i);
            var isSel = i == selIndex;
            var n = optimizeName (layer.name, isSel ? 7 : 8);
            d.setCell (0, i, isSel ? Display.RIGHT_ARROW + n : n, Display.FORMAT_RAW);
        }
    }
    else
        d.setBlock (1, 1, '    Please select').setBlock (1, 2, 'a Device...    ').clearRow (3);
    d.allDone ();
};

DeviceLayerMode.prototype.updateFirstRow = function ()
{
    if (this.model.hasSelectedDevice () && this.model.getCursorDevice ().hasLayers ())
    {
        var cd = this.model.getCursorDevice ();
        for (var i = 0; i < 8; i++)
        {
            var dl = cd.getLayer (i);
            this.surface.lightButton (MaschineButton.TOP_ROW_0 + i, dl.exists);
        }
    }
//    else
//    {
//        for (var i = 0; i < 8; i++)
//            this.surface.setButton (20 + i, PUSH_COLOR_BLACK);
//    }
};

