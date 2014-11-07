// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function DirectParameterMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_BANK_DIRECT;
    
    this.emptyParameter = { name: '', valueStr: '', value: '' };
    this.currentPage = 0;
}
DirectParameterMode.prototype = new BaseMode ();

DirectParameterMode.prototype.onValueKnob = function (index, value)
{
/* TODO FIX REQUIRED
    var param = this.model.getCursorDevice ().getFXParam (index);
    param.value = this.surface.changeValue (value, param.value);
    this.model.getCursorDevice ().setParameter (index, param.value);
*/
};

DirectParameterMode.prototype.onValueKnobTouch = function (index, isTouched) 
{
    if (isTouched && this.surface.isDeletePressed ())
    {
/* TODO Not possible?           
        this.surface.setButtonConsumed (PUSH_BUTTON_DELETE);
        this.model.getCursorDevice ().resetParameter (index);*/
    }
};

DirectParameterMode.prototype.onFirstRow = function (index)
{
    switch (index)
    {
        case 5:
            if (this.currentPage > 0)
                this.currentPage--;
            break;

        case 6:
            var params = this.model.getCursorDevice ().getDirectParameters ();
            if (this.currentPage < Math.floor (params.length / 8) + (params.length % 8 > 0 ? 1 : 0))
                this.currentPage++;
            break;

        case 7:
            this.model.getCursorDevice ().toggleEnabledState ();
            break;
    }
};

DirectParameterMode.prototype.onSecondRow = function (index) {};

DirectParameterMode.prototype.updateDisplay = function () 
{
    var d = this.surface.getDisplay ();
    var selectedDevice = this.model.getSelectedDevice ();
    var hasDevice = this.model.hasSelectedDevice ();

    if (hasDevice)
    {
        var cursorDevice = this.model.getCursorDevice ();
        
        var params = cursorDevice.getDirectParameters ();
        var pageOffset = this.currentPage * 8;
        if (pageOffset >= params.length)
        {
            pageOffset = 0;
            this.currentPage = 0;
        }
        
        for (var i = 0; i < 8; i++)
        {
            var param = pageOffset + i >= params.length ? this.emptyParameter : params[pageOffset + i];
            var isEmpty = param.name.length == 0;
            d.setCell (0, i, param.name, Display.FORMAT_RAW)
             .setCell (1, i, param.valueStr, Display.FORMAT_RAW);

            if (isEmpty)
                d.clearCell (2, i);
            else
                d.setCell (2, i, param.value, Display.FORMAT_RAW);
        }
        
        d.setCell (3, 0, 'Selected', Display.FORMAT_RAW).setCell (3, 1, 'Device: ', Display.FORMAT_RAW)
         .setBlock (3, 1, selectedDevice.name)
         .setCell (3, 4, "Page: " + this.currentPage, Display.FORMAT_RAW)
         .setCell (3, 5, this.currentPage > 0 ? ' < Prev ' : '', Display.FORMAT_RAW)
         .setCell (3, 6, this.currentPage < Math.floor (params.length / 8) + (params.length % 8 > 0 ? 1 : 0) ? ' Next > ' : '', Display.FORMAT_RAW)
         .setCell (3, 7, selectedDevice.enabled ? 'Enabled' : 'Disabled').done (3);
    }
    else
        d.clear ().setBlock (1, 1, '    Please select').setBlock (1, 2, 'a Device...    ').clearRow (3);

    d.allDone ();
};

//DirectParameterMode.prototype.updateFirstRow = function ()
//{
//    if (this.model.hasSelectedDevice ())
//    {
//        var cursorDevice = this.model.getCursorDevice ();
//        var params = cursorDevice.getDirectParameters ();
//        this.surface.setButton (20, PUSH_COLOR_BLACK);
//        this.surface.setButton (21, PUSH_COLOR_BLACK);
//        this.surface.setButton (22, PUSH_COLOR_BLACK);
//        this.surface.setButton (23, PUSH_COLOR_BLACK);
//        this.surface.setButton (24, PUSH_COLOR_BLACK);
//        this.surface.setButton (25, this.currentPage > 0 ? PUSH_COLOR_ORANGE_HI : PUSH_COLOR_BLACK);
//        this.surface.setButton (26, this.currentPage < Math.floor (params.length / 8) + (params.length % 8 > 0 ? 1 : 0) ? PUSH_COLOR_ORANGE_HI : PUSH_COLOR_BLACK);
//        this.surface.setButton (27, this.model.getSelectedDevice ().enabled ? PUSH_COLOR_GREEN_LO : PUSH_COLOR_BLACK);
//    }
//    else
//    {
//        for (var i = 0; i < 8; i++)
//            this.surface.setButton (20 + i, PUSH_COLOR_BLACK);
//    }
//};

//DirectParameterMode.prototype.updateSecondRow = function ()
//{
//    for (var i = 0; i < 8; i++)
//        this.surface.setButton (102 + i, this.model.getCursorDevice().isMacroMapping(i) ? PUSH_COLOR_GREEN_HI_FBLINK : PUSH_COLOR_BLACK);
//};
