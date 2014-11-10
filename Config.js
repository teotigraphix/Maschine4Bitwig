// ------------------------------
// Static configurations
// ------------------------------

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

Config.accentActive      = false;                       // Accent button active
Config.fixedAccentValue  = 127;                         // Fixed velocity value for accent
Config.scale             = 'Major';
Config.scaleBase         = 'C';
Config.scaleInKey        = true;
Config.scaleLayout       = '4th ^';

Config.padTrackColor    = true;


// label, category, options, initialValue
function Configurator () {}

Configurator.getSettingScopes = function (scopes)
{
    var global = host.getPreferences ();
    var project = host.getDocumentState ();
    if (scopes == "all")
        return [global, project];
    else if (scopes == "global")
        return [global];
    if (scopes == "project")
        return [project];
    return null;
};

Configurator.addEnumSetting = function (scopes, id, property, label, category, options, initialValue, callback)
{
    var settings = Configurator.getSettingScopes (scopes);
    for (var i = 0; i < settings.length; i++)
    {
        Config[property] = settings[i].getEnumSetting (label, category, options, initialValue);
        Config[property].addValueObserver (function (value)
        {
            if (callback != null)
                callback.apply (null, [value]);
            Config.notifyListeners (id);
        });
    }
};

Configurator.getNumberSetting = function(scopes, id, property, label, category, minValue, maxValue,
                                         stepResolution, unit, initialValue, callback)
{
    var settings = Configurator.getSettingScopes (scopes);
    for (var i = 0; i < settings.length; i++)
    {
        Config[property] = settings[i].getNumberSetting (label, category, minValue, maxValue, stepResolution, unit, initialValue);
        Config[property].addRawValueObserver (function (value)
        {
            if (callback != null)
                callback.apply (null, [value]);
            Config.notifyListeners (id);
        });
    }
};

Config.init = function ()
{
    var prefs = host.getPreferences ();
    //var prefs = host.getDocumentState ();

    ///////////////////////////
    // Pads

    Configurator.addEnumSetting ("project", Config.ACTIVATE_FIXED_ACCENT, "padTrackColorSetting",
        "Pad Track Coloring", "Pads", [ "Off", "On" ], "Off",
        function (value) {
            Config.padTrackColor = value == "On";
        });

    ///////////////////////////
    // Accent

    Configurator.addEnumSetting ("project", Config.ACTIVATE_FIXED_ACCENT, "accentActiveSetting",
        "Activate Fixed Accent", "Fixed Accent", [ "Off", "On" ], "Off",
        function (value) {
            Config.accentActive = value == "On";
        });

    Configurator.getNumberSetting ("project", Config.FIXED_ACCENT_VALUE, "accentValueSetting",
        "Fixed Accent Value", "Fixed Accent", 1, 127, 1, "", 127,
        function (value) {
            Config.fixedAccentValue = value;
        });

    ///////////////////////////
    // Scale

    var scaleNames = Scales.getNames ();
    Configurator.addEnumSetting ("project", Config.SCALES_SCALE, "scaleSetting",
        "Scale", "Scales", scaleNames, scaleNames[0],
        function (value) {
            Config.scale = value;
        });

    Configurator.addEnumSetting ("project", Config.SCALES_BASE, "scaleBaseSetting",
        "Base", "Scales", Scales.BASES, Scales.BASES[0],
        function (value) {
            Config.scaleBase = value;
        });

    Configurator.addEnumSetting ("project", Config.SCALES_IN_KEY, "scaleInScaleSetting",
        "In Key", "Scales", [ "In Key", "Chromatic" ], "In Key",
        function (value) {
            Config.scaleInKey = value;
        });

    Configurator.addEnumSetting ("project", Config.SCALES_LAYOUT, "scaleLayoutSetting",
        "Layout", "Scales", Scales.LAYOUT_NAMES, Scales.LAYOUT_NAMES[0],
        function (value) {
            Config.scaleLayout = value;
        });
};

Config.setPadTrackColor = function (enabled)
{
    Config.padTrackColorSetting.set (enabled ? "On" : "Off");
};

Config.setAccentEnabled = function (enabled)
{
    Config.accentActiveSetting.set (enabled ? "On" : "Off");
};

Config.setAccentValue = function (value)
{
    Config.accentValueSetting.setRaw (value);
};

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
