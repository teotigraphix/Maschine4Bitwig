Config.RIBBON_MODE_PITCH = 0;
Config.RIBBON_MODE_CC    = 1;
Config.RIBBON_MODE_MIXED = 2;

Config.FIXED_ACCENT_VALUE  = 0;
Config.INC_FRACTION_VALUE  = 1;
Config.MAX_PARAMETER_VALUE = 2;
Config.RIBBON_MODE         = 3;
Config.RIBBON_MODE_CC_VAL  = 4;

// Accent button active
Config.accentActive      = false;
// Fixed velocity value for accent
Config.fixedAccentValue  = 127;
// Inc/Dec of knobs
Config.fractionValue     = 1;
Config.fractionMinValue  = 0.5;
Config.maxParameterValue = 128;
// What does the ribbon send?
Config.ribbonMode        = Config.RIBBON_MODE_PITCH;
Config.ribbonModeCCVal   = 1;

// How fast the track and scene arrows scroll the banks/scenes
Config.trackScrollInterval = 100;
Config.sceneScrollInterval = 100;


Config.setAccentValue = function (value)
{
    Config.fixedAccentValue = value;
    Config.notifyListeners (Config.FIXED_ACCENT_VALUE);
}


//
// Property listeners
//

Config.listeners = [];
for (var i = Config.FIXED_ACCENT_VALUE; i <= Config.FIXED_ACCENT_VALUE; i++)
    Config.listeners[i] = [];

Config.addPropertyListener = function (property, listener)
{
    Config.listeners[property].push (listener);
};

Config.notifyListeners = function (property)
{
    var ls = Config.listeners[property];
    for (var i = 0; i < ls.length; i++)
        ls[i].call (null);
}

function Config () {}