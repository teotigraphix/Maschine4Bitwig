
AbstractSessionView.CLIP_COLOR_IS_RECORDING        = { color: COLOR.RECORD, blink: null, fast: false };
AbstractSessionView.CLIP_COLOR_IS_RECORDING_QUEUED = { color: COLOR.ARM, blink: null, fast: false };
AbstractSessionView.CLIP_COLOR_IS_PLAYING          = { color: COLOR.LAUNCHED_SCENE_WITH_CONTENT, blink: null, fast: false };
AbstractSessionView.CLIP_COLOR_IS_PLAYING_QUEUED   = { color: COLOR.LAUNCHED_SCENE_WITH_CONTENT, blink: null, fast: false };
AbstractSessionView.CLIP_COLOR_HAS_CONTENT         = { color: COLOR.SCENE_WITH_CONTENT, blink: null, fast: false };
AbstractSessionView.CLIP_COLOR_NO_CONTENT          = { color: COLOR.SCENE_WITHOUT_CONTENT, blink: null, fast: false };
AbstractSessionView.CLIP_COLOR_RECORDING_ARMED     = { color: COLOR.ARM, blink: null, fast: false };
AbstractSessionView.USE_CLIP_COLOR                 = false;

function SessionViewMS (model)
{
    AbstractSessionView.call (this, model, 4, 4);
}
SessionViewMS.prototype = new AbstractSessionView ();

SessionViewMS.prototype.onActivate = function ()
{
    println("SessionViewMS.onActivate()");
    AbstractSessionView.prototype.onActivate.call (this);
    this.surface.setButton (MaschineButton.PAD_MODE, MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.STEP_MODE, MaschineButton.STATE_UP);
    this.surface.setButton (MaschineButton.SCENE, MaschineButton.STATE_DOWN);
};

SessionViewMS.prototype.drawSceneButtons = function ()
{

};
