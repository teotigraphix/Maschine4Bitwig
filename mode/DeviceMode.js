
function DeviceMode (model)
{
    BaseMode.call (this, model);
    this.id = MODE_DEVICE;
}

DeviceMode.prototype = new BaseMode();

DeviceMode.prototype.onTopRow = function (event, index)
{
    if (!event.isDown ())
        return;

    println("DeviceMode.onTopRow()" + index);
    switch (index)
    {
        case 0:
            this.model.getCursorDevice ().selectPrevious ();
            break;

        case 1:
            this.model.getCursorDevice ().selectNext ();
            break;

        case 6:
            //if (hasNextParameterPage)
            this.model.getCursorDevice ().previousParameterPage ();
            break;

        case 7:
            //if (hasNextParameterPage)
            this.model.getCursorDevice ().nextParameterPage ();
            break;

//        case 7:
//            // this.model.getCursorDevice ().toggleEnabledState ();
//            break;
    }
};

DeviceMode.prototype.onValueKnob = function (index, value)
{
    println("DeviceMode.onValueKnob()" + index + ", " + value);
    var param = this.model.getCursorDevice ().getFXParam (index);
    param.value = this.surface.changeValue (value, param.value);
    //println(param.value);
    this.model.getCursorDevice ().setParameter (index, param.value);
};
