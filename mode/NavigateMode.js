
function NavigateMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_NAVIGATE;
}
NavigateMode.prototype = new BaseMode ();

NavigateMode.prototype.onValueKnob = function (index, value)
{
};

NavigateMode.prototype.onFirstRow = function (event, index)
{
};

NavigateMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    d.clear ();
    if (this.model.hasSelectedDevice ())
    {
        var selectedDevice = this.model.getSelectedDevice ();
        var cursorDevice = this.model.getCursorDevice ();
        var names = cursorDevice.parameterPageNames;
        var row = 0;
        for (var i = 0; i < names.length; i++)
        {
            d.setCell (0, i, names[i]);
            if (i == 7)
                row++;
        }
    }

    d.allDone ();
};


NavigateMode.prototype.updateFirstRow = function ()
{

};