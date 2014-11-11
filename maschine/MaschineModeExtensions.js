
Maschine.isDeviceBankMode = function (modeId)
{
    for (var i = 0; i < Maschine.MODE_BANKS.length; i++)
        if (Maschine.MODE_BANKS[i].id == modeId)
            return true;
    return false;
};

Maschine.isDeviceMode = function (modeId)
{
    return Maschine.isDeviceBankMode (modeId) || modeId == Maschine.MODE_BANK_DEVICE;
};

Maschine.getModeBankNames = function ()
{
    var result = [];
    for (var i = 0; i < Maschine.MODE_BANKS.length; i++)
        result.push (Maschine.MODE_BANKS[i].name);
    return result;
}

Maschine.setDefaultModeBankString = function (modeName)
{
    for (var i = 0; i < Maschine.MODE_BANKS.length; i++)
    {
        if (Maschine.MODE_BANKS[i].name == modeName)
        {
            Maschine.setDefaultModeBank (Maschine.MODE_BANKS[i].id);
            break;
        }
    }
};

Maschine.getDefaultModeBankName = function ()
{
    for (var i = 0; i < Maschine.MODE_BANKS.length; i++)
        if (Maschine.MODE_BANKS[i].isDefault)
            return Maschine.MODE_BANKS[i].name;
}

Maschine.getDefaultModeBankId = function ()
{
    for (var i = 0; i < Maschine.MODE_BANKS.length; i++)
        if (Maschine.MODE_BANKS[i].isDefault)
            return Maschine.MODE_BANKS[i].id;
};

Maschine.setDefaultModeBank = function (modeId)
{
    for (var i = 0; i < Maschine.MODE_BANKS.length; i++)
    {
        Maschine.MODE_BANKS[i].isDefault = Maschine.MODE_BANKS[i].id == modeId;
    }
};

Maschine.getModeName = function (modeId)
{
    for (var i = 0; i < Maschine.MODE_BANKS.length; i++)
    {
        if (Maschine.MODE_BANKS[i].id == modeId)
            return Maschine.MODE_BANKS[i].name;
    }
};