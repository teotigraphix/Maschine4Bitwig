
AbstractSceneView.CLIP_COLOR_IS_RECORDING        = { color: COLOR.RECORD, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_RECORDING_QUEUED = { color: COLOR.RED_MEDIUM, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_PLAYING          = { color: COLOR.GREEN, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_PLAYING_QUEUED   = { color: COLOR.YELLOW, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_HAS_CONTENT         = { color: COLOR.SCENE_WITH_CONTENT, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_STOPPING_QUEUED  = { color: COLOR.ON_DIM, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_NO_CONTENT          = { color: COLOR.OFF, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_RECORDING_ARMED     = { color: COLOR.RED_DIM, blink: null, fast: false };
AbstractSceneView.USE_CLIP_COLOR                 = true;

function SceneView (model)
{
    AbstractSceneView.call (this, model, 4, 4);
}
SceneView.prototype = new AbstractSceneView ();

SceneView.prototype.onActivate = function ()
{
    AbstractSceneView.prototype.onActivate.call (this);

    this.surface.setButton (MaschineButton.SCENE, MaschineButton.STATE_DOWN);
    this.surface.setButton (MaschineButton.PATTERN, MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.PAD_MODE, MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.NAVIGATE, MaschineButton.STATE_UP);

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
