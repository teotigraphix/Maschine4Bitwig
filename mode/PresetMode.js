// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function PresetMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_PRESET;
    this.isTemporary = false;

    this.knobInvalidated = false;
    
    this.firstRowButtons = [];
    this.firstRowButtons[22] = {};
    this.firstRowButtons[24] = {};
    this.firstRowButtons[26] = {};
    
    this.secondRowButtons = [];
    this.secondRowButtons[104] = {};
    this.secondRowButtons[106] = {};
    this.secondRowButtons[108] = {};
}
PresetMode.prototype = new BaseMode ();

PresetMode.knobDuration = 150;
PresetMode.firstRowButtonColor = COLOR.GREEN;
PresetMode.secondRowButtonColor = COLOR.GREEN;

PresetMode.prototype.onActivate = function ()
{
};

PresetMode.prototype.onValueKnob = function (index, value)
{
    if (this.knobInvalidated)
        return;
    
    this.knobInvalidated = true;

    scheduleTask (doObject (this, function ()
    {
        this.onValueKnobTurn (index, value >= 61);
        this.knobInvalidated = false;
    }), null, PresetMode.knobDuration - (this.surface.isShiftPressed ()) ? 100 : 0);
};


PresetMode.prototype.onValueKnobTurn = function (index, isInc)
{
    var device = this.model.getCursorDevice ();
    var count = this.surface.isShiftPressed () ? 2 : 1;
    for (var i = 0; i < count; i++)
    {
        switch (index)
        {
            case 2:
            case 3:
                if (isInc)
                    device.switchToNextPresetCategory ();
                else
                    device.switchToPreviousPresetCategory ();
                break;
            case 4:
            case 5:
                if (isInc)
                    device.switchToNextPresetCreator ();
                else
                    device.switchToPreviousPresetCreator ();
                break;
            case 6:
            case 7:
                if (isInc)
                    device.switchToNextPreset ();
                else
                    device.switchToPreviousPreset ();
                break;
        }
    }
};

PresetMode.prototype.onFirstRow = function (index)
{
    var device = this.model.getCursorDevice ();
    var count = this.surface.isShiftPressed () ? 2 : 1;
    for (var i = 0; i < count; i++)
    {
        switch (index)
        {
            case 2:
                device.switchToPreviousPresetCategory ();
                break;
            case 3:
                device.switchToNextPresetCategory ();
                break;
            case 4:
                device.switchToPreviousPresetCreator ();
                break;
            case 5:
                device.switchToNextPresetCreator ();
                break;
            case 6:
                device.switchToPreviousPreset ();
                break;
            case 7:
                device.switchToNextPreset ();
                break;
        }
    }
};

PresetMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    var cd = this.model.getCursorDevice ();

    if (!this.model.hasSelectedDevice ())
    {
        d.clear ()
         .setBlock (1, 1, '    Please select').setBlock (1, 2, 'a Device...    ')
         .allDone ();
        return;
    }

    d.clearColumn (0).setBlock ( 0, 0, "Select Preset:")
     .setBlock (1, 0, "Device:" + this.model.getSelectedDevice ().name);
    
    // Categories column
    var view = cd.categoryProvider.getView (2);
    for (var i = 0; i < 2; i++)
        d.setBlock (i, 1, (i == 0 ? '>' : ' ') + (view[i] != null ? PresetMode.optimizeName(i == 0, view[i]) : ""));
    
    // Creator column
    view = cd.creatorProvider.getView (2);
    for (var i = 0; i < 2; i++)
        d.setBlock (i, 2, (i == 0 ? '>' : ' ') + (view[i] != null ? PresetMode.optimizeName(i == 0, view[i]) : ""));

    // Preset column
    view = cd.presetProvider.getView (2);
    for (var i = 0; i < 2; i++)
        d.setBlock (i, 3, (i == 0 ? '>' : ' ') + (view[i] != null ? PresetMode.optimizeName(i == 0, view[i]) : ""));
        
    d.allDone ();
};

PresetMode.optimizeName = function (clip, name)
{
    var len = clip ? 12 : 13;
    if (name.length < len)
        return name;
    name = optimizeName(name, len);
    if (name.length > 13)
        name = name.substr (0, 12);
    return name;
};

PresetMode.prototype.updateFirstRow = function ()
{
    //for (var i = 20; i < 28; i++)
    //    this.surface.setButton (i, this.firstRowButtons[i] != null ? PresetMode.firstRowButtonColor : COLOR.OFF);
    this.surface.setButton (MaschineButton.TOP_ROW_2, MaschineButton.STATE_DOWN);
    this.surface.setButton (MaschineButton.TOP_ROW_3, MaschineButton.STATE_DOWN);
    this.surface.setButton (MaschineButton.TOP_ROW_4, MaschineButton.STATE_DOWN);
    this.surface.setButton (MaschineButton.TOP_ROW_5, MaschineButton.STATE_DOWN);
    this.surface.setButton (MaschineButton.TOP_ROW_6, MaschineButton.STATE_DOWN);
    this.surface.setButton (MaschineButton.TOP_ROW_7, MaschineButton.STATE_DOWN);
};

