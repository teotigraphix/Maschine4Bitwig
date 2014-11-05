// ------------------------------
// Static configurations
// ------------------------------

GlobalConfig.MASTER_TRACK_TEXT_LENGTH  = 6;
GlobalConfig.TRACK_BANK_TEXT_LENGTH    = 6;
GlobalConfig.CURSOR_DEVICE_TEXT_LENGTH = 6;

// Inc/Dec of knobs
Config.fractionValue     = 1;
Config.fractionMinValue  = 0.5;
Config.maxParameterValue = 127;

// How fast the track and scene arrows scroll the banks/scenes
Config.trackScrollInterval = 100;
Config.sceneScrollInterval = 100;


// ------------------------------
// Editable configurations
// ------------------------------

Config.ACTIVATE_FIXED_ACCENT = 0;
Config.FIXED_ACCENT_VALUE    = 1;
Config.RIBBON_MODE           = 2;
Config.RIBBON_MODE_CC_VAL    = 3;
Config.SCALES_SCALE          = 4;
Config.SCALES_BASE           = 5;
Config.SCALES_IN_KEY         = 6;
Config.SCALES_LAYOUT         = 7;

Config.RIBBON_MODE_PITCH = 0;
Config.RIBBON_MODE_CC    = 1;
Config.RIBBON_MODE_MIXED = 2;

Config.accentActive      = false;                       // Accent button active
Config.fixedAccentValue  = 127;                         // Fixed velocity value for accent
Config.ribbonMode        = Config.RIBBON_MODE_PITCH;    // What does the ribbon send?
Config.ribbonModeCCVal   = 1;
Config.scale             = 'Major';
Config.scaleBase         = 'C';
Config.scaleInKey        = true;
Config.scaleLayout       = '4th ^';

Config.init = function ()
{
    var prefs = host.getPreferences ();

    ///////////////////////////
    // Accent

    Config.accentActiveSetting = prefs.getEnumSetting ("Activate Fixed Accent", "Fixed Accent", [ "Off", "On" ], "Off");
    Config.accentActiveSetting.addValueObserver (function (value)
    {
        Config.accentActive = value == "On";
        Config.notifyListeners (Config.ACTIVATE_FIXED_ACCENT);
    });

    Config.accentValueSetting = prefs.getNumberSetting ("Fixed Accent Value", "Fixed Accent", 1, 127, 1, "", 127);
    Config.accentValueSetting.addRawValueObserver (function (value)
    {
        Config.fixedAccentValue = value;
        Config.notifyListeners (Config.FIXED_ACCENT_VALUE);
    });

//    ///////////////////////////
//    // Ribbon
//
//    Config.ribbonModeSetting = prefs.getEnumSetting ("Mode", "Ribbon", [ "Pitch", "CC", "Mixed" ], "Pitch");
//    Config.ribbonModeSetting.addValueObserver (function (value)
//    {
//        switch (value)
//        {
//            case "Pitch": Config.ribbonMode = 0; break;
//            case "CC": Config.ribbonMode = 1; break;
//            case "Mixed": Config.ribbonMode = 2; break;
//        }
//        Config.notifyListeners (Config.RIBBON_MODE);
//    });
//
//    Config.ribbonModeCCSetting = prefs.getNumberSetting ("CC", "Ribbon", 0, 127, 1, "", 1);
//    Config.ribbonModeCCSetting.addRawValueObserver (function (value)
//    {
//        Config.ribbonModeCCVal = Math.floor (value);
//        Config.notifyListeners (Config.RIBBON_MODE_CC_VAL);
//    });

    ///////////////////////////
    // Scale

    var scaleNames = Scales.getNames ();
    Config.scaleSetting = prefs.getEnumSetting ("Scale", "Scales", scaleNames, scaleNames[0]);
    Config.scaleSetting.addValueObserver (function (value)
    {
        Config.scale = value;
        Config.notifyListeners (Config.SCALES_SCALE);
    });

    Config.scaleBaseSetting = prefs.getEnumSetting ("Base", "Scales", Scales.BASES, Scales.BASES[0]);
    Config.scaleBaseSetting.addValueObserver (function (value)
    {
        Config.scaleBase = value;
        Config.notifyListeners (Config.SCALES_BASE);
    });

    Config.scaleInScaleSetting = prefs.getEnumSetting ("In Key", "Scales", [ "In Key", "Chromatic" ], "In Key");
    Config.scaleInScaleSetting.addValueObserver (function (value)
    {
        Config.scaleInKey = value == "In Key";
        Config.notifyListeners (Config.SCALES_IN_KEY);
    });

    Config.scaleLayoutSetting = prefs.getEnumSetting ("Layout", "Scales", Scales.LAYOUT_NAMES, Scales.LAYOUT_NAMES[0]);
    Config.scaleLayoutSetting.addValueObserver (function (value)
    {
        Config.scaleLayout = value;
        Config.notifyListeners (Config.SCALES_LAYOUT);
    });
};

Config.setAccentEnabled = function (enabled)
{
    Config.accentActiveSetting.set (enabled ? "On" : "Off");
};

Config.setAccentValue = function (value)
{
    Config.accentValueSetting.setRaw (value);
};

//Config.setRibbonMode = function (mode)
//{
//    switch (mode)
//    {
//        case Config.RIBBON_MODE_PITCH: Config.ribbonModeSetting.set ("Pitch"); break;
//        case Config.RIBBON_MODE_CC: Config.ribbonModeSetting.set ("CC"); break;
//        case Config.RIBBON_MODE_MIXED: Config.ribbonModeSetting.set ("Mixed"); break;
//    }
//};
//
//Config.setRibbonModeCC = function (value)
//{
//    Config.ribbonModeCCSetting.setRaw (value);
//};

Config.setScale = function (scale)
{
    Config.scaleSetting.set (scale);
};

Config.setScaleBase = function (scaleBase)
{
    Config.scaleBaseSetting.set (scaleBase);
};

Config.setScaleInScale = function (inScale)
{
    Config.scaleInScaleSetting.set (inScale ? "In Key" : "Chromatic");
};

Config.setScaleLayout = function (scaleLayout)
{
    Config.scaleLayoutSetting.set (scaleLayout);
};

// ------------------------------
// Property listeners
// ------------------------------

Config.listeners = [];
for (var i = 0; i <= Config.SCALES_LAYOUT; i++)
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
};

function Config () {}
