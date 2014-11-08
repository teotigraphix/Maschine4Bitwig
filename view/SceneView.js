
AbstractSceneView.CLIP_COLOR_IS_RECORDING        = { color: COLOR.RECORD, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_RECORDING_QUEUED = { color: COLOR.ARM, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_PLAYING          = { color: COLOR.PLAY, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_PLAYING_QUEUED   = { color: COLOR.LAUNCHED_SCENE_WITH_CONTENT, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_HAS_CONTENT         = { color: COLOR.SCENE_WITH_CONTENT, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_NO_CONTENT          = { color: COLOR.OFF, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_RECORDING_ARMED     = { color: COLOR.ARM, blink: null, fast: false };
AbstractSceneView.USE_CLIP_COLOR                 = false;

function SceneView (model)
{
    AbstractSceneView.call (this, model, 4, 4);
}
SceneView.prototype = new AbstractSceneView ();

SceneView.prototype.onActivate = function ()
{
    AbstractSceneView.prototype.onActivate.call (this);
    this.surface.setButton (MaschineButton.PAD_MODE, MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.PATTERN, MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.STEP_MODE, MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.SCENE, MaschineButton.STATE_DOWN);
};

SceneView.prototype.onSelect = function (event)
{
};

SceneView.prototype.onGridNote = function (note, velocity)
{
    if (!this.surface.isPressed(MaschineButton.SCENE))
    {
        AbstractSceneView.prototype.onGridNote.call (this, note, velocity);
    }
    else
    {
        if (velocity == 0)
            return;

        var index = note - 36;
        var t = index % this.columns;
        var tb = this.getCurrentTrackBank ();
        var slots = tb.getClipLauncherSlots (t);
        slots.stop ();
    }
};

function getColor (colorId)
{
    var len = AbstractTrackBankProxy.COLORS.length;
    for (var i = 0; i < len; i++)
    {
        if (AbstractTrackBankProxy.COLORS[i][3] == colorId)
        {
            var entry = AbstractTrackBankProxy.COLORS[i];
            var c = rgb2hsl(entry);
            println(c);
            return new Color(c[0], c[1], c[2]);
        }
    }
}

function rgb2hsl(rgbArr){
    var r1 = rgbArr[0] / 255;
    var g1 = rgbArr[1] / 255;
    var b1 = rgbArr[2] / 255;

    var maxColor = Math.max(r1,g1,b1);
    var minColor = Math.min(r1,g1,b1);
    //Calculate L:
    var L = (maxColor + minColor) / 2 ;
    var S = 0;
    var H = 0;
    if(maxColor != minColor){
        //Calculate S:
        if(L < 0.5){
            S = (maxColor - minColor) / (maxColor + minColor);
        }else{
            S = (maxColor - minColor) / (2.0 - maxColor - minColor);
        }
        //Calculate H:
        if(r1 == maxColor){
            H = (g1-b1) / (maxColor - minColor);
        }else if(g1 == maxColor){
            H = 2.0 + (b1 - r1) / (maxColor - minColor);
        }else{
            H = 4.0 + (r1 - g1) / (maxColor - minColor);
        }
    }

    L = L * 100;
    S = S * 100;
    H = H * 60;
    if(H<0){
        H += 360;
    }
    var result = [H, S, L];
    return result;
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b){
    r *= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgbToHsv(r, g, b){
    r = r/255, g = g/255, b = b/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
}