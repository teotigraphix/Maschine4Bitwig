// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function SelectMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_SELECT;
}
SelectMode.prototype = new BaseMode ();

SelectMode.prototype.onValueKnob = function (index, value)
{
};

SelectMode.prototype.onFirstRow = function (event, index)
{
};

SelectMode.prototype.updateDisplay = function ()
{
    var modeId = this.surface._previousModeId;
    var d = this.surface.getDisplay ();
    d.clear ();

    var modes = Maschine.MODES;
    var column = 0;

    for (var i = 0; i < 4; i++)
    {
        if (i == 0)
            d.setCell(0, column, this.getName(
                optimizeName(Maschine.getDefaultModeBankName (), 5),
                Maschine.getDefaultModeBankId (), modeId));
        else
            d.setCell(0, column, this.getModeName (modes[i], modeId));
        column++;
    }

    column = 0;
    for (var i = 4; i < 8; i++)
    {
        d.setCell(1, column, this.getModeName (modes[i], modeId));
        column++;
    }

    column = 4;
    for (var i = 8; i < 12; i++)
    {
        if (modes[i] == null)
            break;
        d.setCell(0, column, this.getModeName (modes[i], modeId));
        column++;
    }

    column = 4;
    for (var i = 12; i < 16; i++)
    {
        if (modes[i] == null)
            break;
        d.setCell(1, column, this.getModeName (modes[i], modeId));
        column++;
    }

    d.allDone ();
};

SelectMode.prototype.getName = function (name, modeId, activeModeId)
{
    if (modeId == activeModeId)
        name = ">" + name;
    return name;
}

SelectMode.prototype.getModeName = function (mode, activeModeId)
{
    var modeId = mode[0];
    var name = mode[1];
    if (modeId == activeModeId)
        name = ">" + name;
    return name;
}

SelectMode.prototype.updateFirstRow = function ()
{

};