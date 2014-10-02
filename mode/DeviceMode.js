
function BaseMode (model)
{
    AbstractMode.call (this, model);
}
BaseMode.prototype = new AbstractMode ();

function DeviceMode (model)
{
    BaseMode.call (this, model);
    this.id = MaschineStudio.MODE_BANK_DEVICE;
}
DeviceMode.prototype = new BaseMode ();
