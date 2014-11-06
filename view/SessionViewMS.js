
AbstractSessionView.CLIP_COLOR_IS_RECORDING        = { color: COLOR.RECORD, blink: null, fast: false };
AbstractSessionView.CLIP_COLOR_IS_RECORDING_QUEUED = { color: COLOR.ARM, blink: null, fast: false };
AbstractSessionView.CLIP_COLOR_IS_PLAYING          = { color: COLOR.PLAY, blink: null, fast: false };
AbstractSessionView.CLIP_COLOR_IS_PLAYING_QUEUED   = { color: COLOR.LAUNCHED_SCENE_WITH_CONTENT, blink: null, fast: false };
AbstractSessionView.CLIP_COLOR_HAS_CONTENT         = { color: COLOR.SCENE_WITH_CONTENT, blink: null, fast: false };
AbstractSessionView.CLIP_COLOR_NO_CONTENT          = { color: COLOR.OFF, blink: null, fast: false };
AbstractSessionView.CLIP_COLOR_RECORDING_ARMED     = { color: COLOR.ARM, blink: null, fast: false };
AbstractSessionView.USE_CLIP_COLOR                 = false;

function SessionViewMS (model)
{
    AbstractSessionView.call (this, model, 4, 4);
}
SessionViewMS.prototype = new AbstractSessionView ();

SessionViewMS.prototype.onActivate = function ()
{
    AbstractSessionView.prototype.onActivate.call (this);
    this.surface.setButton (MaschineButton.PAD_MODE, MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.PATTERN, MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.STEP_MODE, MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.SCENE, MaschineButton.STATE_DOWN);
};

SessionViewMS.prototype.onSelect = function ()
{
};

SessionViewMS.prototype.onGridNote = function (note, velocity)
{
    if (!this.surface.isPressed(MaschineButton.SCENE))
    {
        AbstractSessionView.prototype.onGridNote.call (this, note, velocity);
    }
    else
    {
        if (velocity == 0)
            return;

        var index = note - 36;
        var t = index % this.columns;
        var s = (this.rows - 1) - Math.floor (index / this.columns);

        var tb = this.model.getCurrentTrackBank ();
        var slot = tb.getTrack (t).slots[s];
        var slots = tb.getClipLauncherSlots (t);
        slots.stop ();
    }
};

SessionViewMS.prototype.drawSceneButtons = function ()
{

};
