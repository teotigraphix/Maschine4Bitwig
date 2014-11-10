// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function ParamPageSelectMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_PARAM_PAGE_SELECT;
    this.bottomItems = [];
    this.selectedIndex = 0;
    this.knobInvalidated = false;
}
ParamPageSelectMode.prototype = new BaseMode ();

ParamPageSelectMode.prototype.getCurrentMode = function ()
{
    return this.currentMode;
};

ParamPageSelectMode.prototype.setCurrentMode = function (mode)
{
    this.currentMode = mode;
    this.currentModeChanged ();
    this.clearTopRow ();
    this.updateFirstRow ();
    //this.surface.setPendingMode (this.currentMode);
    this.surface._previousDeviceBankModeId = this.currentMode;
};

ParamPageSelectMode.prototype.isPageMode = function (modeId)
{
    for (var i = 0; i < this.bottomItems.length; i++)
    {
        if (this.bottomItems[i].getModeId () == modeId)
            return true;
    }
    return false;
};

ParamPageSelectMode.prototype.currentModeChanged = function ()
{
    this.selectedIndex = 0;
    for (var i = 0; i < this.bottomItems.length; i++)
    {
        if (this.bottomItems[i].getModeId () == this.currentMode)
        {
            this.selectedIndex = i;
            break;
        }
    }
};

ParamPageSelectMode.prototype.attachTo = function (surface)
{
    BaseMode.prototype.attachTo.call (this, surface);

    this.addFirstRowCommand ('Device', Maschine.MODE_BANK_DEVICE);
    this.addFirstRowCommand ('Common', Maschine.MODE_BANK_COMMON);
    this.addFirstRowCommand ('Envlp ', Maschine.MODE_BANK_ENVELOPE);
    this.addFirstRowCommand ('Direct', Maschine.MODE_BANK_DIRECT);
    this.addFirstRowCommand ('Macro ', Maschine.MODE_BANK_MACRO);
    this.addFirstRowCommand (' Mod  ', Maschine.MODE_BANK_MODULATE);
    this.addFirstRowCommand (' User ', Maschine.MODE_BANK_USER);
    
    this.setCurrentMode (Maschine.MODE_BANK_DEVICE);
};

ParamPageSelectMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    d.clear ();
    for (var i = 0; i < this.bottomItems.length; i++)
        d.setCell (0, i, this.bottomItems[i].getLabel ());

    if (this.model.hasSelectedDevice ())
    {
        var selectedDevice = this.model.getSelectedDevice ();
        var cursorDevice = this.model.getCursorDevice ();

        // TODO if ever more than 7 param banks this will break
        d.setCell (0, 7, selectedDevice.enabled ? 'Disabl' : 'Enable');

        d.setBlock(1, 0, selectedDevice.name);
        d.setCell (1, 4, cursorDevice.getSelectedParameterPageName (), Display.FORMAT_RAW);

//        .setCell (1, 6, cursorDevice.hasPreviousParameterPage () ? '< Prev' : '', Display.FORMAT_RAW)
//        .setCell (1, 7, cursorDevice.hasNextParameterPage () ? 'Next >' : '', Display.FORMAT_RAW)
    }

    d.allDone ();
};

ParamPageSelectMode.prototype.updateFirstRow = function ()
{
    this.surface.setButton (MaschineButton.TOP_ROW_0 + this.selectedIndex, MaschineButton.STATE_DOWN);
    var cd = this.model.getCursorDevice ();
    if (cd.hasSelectedDevice ())
    {
        this.surface.setButton (MaschineButton.TOP_ROW_7,
            cd.getSelectedDevice ().enabled ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);
    }
};

ParamPageSelectMode.knobDuration = 350;

ParamPageSelectMode.prototype.onValueKnob = function (index, value)
{
//    if (this.knobInvalidated)
//        return;
//
//    this.knobInvalidated = true;
//
//    scheduleTask (doObject (this, function ()
//    {
//        var device = this.model.getCursorDevice ();
//        if (index == 6 && value > 65)
//        {
//            if (device.hasPreviousParameterPage ())
//                device.previousParameterPage ();
//        }
//        else if (index == 7 && value < 65)
//        {
//            if (device.hasNextParameterPage ())
//                device.nextParameterPage ();
//        }
//        this.knobInvalidated = false;
//    }), null, ParamPageSelectMode.knobDuration - (this.surface.isShiftPressed ()) ? 100 : 0);
};

ParamPageSelectMode.prototype.onFirstRow = function (index)
{
    var device = this.model.getCursorDevice ();

    if (index < 7)
        this.bottomItems[index].execute ();
    else if (index == 7)
        device.toggleEnabledState ();
};

ParamPageSelectMode.prototype.addFirstRowCommand = function (label, modeId)
{
    this.bottomItems.push (new ModeToggleCommand (label, modeId,
        doObject (this, function () { this.setCurrentMode (modeId); })));
};

function ModeToggleCommand (label, modeId, command)
{
    this.label = label;
    this.modeId = modeId;
    this.command = command;
}

ModeToggleCommand.prototype.getLabel = function ()
{
    return this.label;
};

ModeToggleCommand.prototype.getModeId = function ()
{
    return this.modeId;
};

ModeToggleCommand.prototype.execute = function ()
{
    this.command.call (this);
};