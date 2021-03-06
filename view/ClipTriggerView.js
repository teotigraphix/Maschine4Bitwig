// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

AbstractSceneView.CLIP_COLOR_IS_RECORDING        = { color: COLOR.RED, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_RECORDING_QUEUED = { color: COLOR.RED_MEDIUM, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_PLAYING          = { color: COLOR.GREEN, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_PLAYING_QUEUED   = { color: COLOR.YELLOW, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_HAS_CONTENT         = { color: COLOR.OFF, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_STOPPING_QUEUED  = { color: COLOR.ON_DIM, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_NO_CONTENT          = { color: COLOR.OFF, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_RECORDING_ARMED     = { color: COLOR.RED_DIM, blink: null, fast: false };
AbstractSceneView.USE_CLIP_COLOR                 = true;

function ClipTriggerView (model)
{
    AbstractSceneView.call (this, model, 4, 4);
}
ClipTriggerView.prototype = new AbstractSceneView ();

ClipTriggerView.prototype.onActivate = function ()
{
    AbstractSceneView.prototype.onActivate.call (this);
};

ClipTriggerView.prototype.onGridNote = function (note, velocity)
{
    if (velocity == 0)
        return;

    var index = note - 36;
    var t = index % this.columns;
    var s = (this.rows - 1) - Math.floor (index / this.columns);

    var tb = this.getCurrentTrackBank ();
    var slot = tb.getTrack (t).slots[s];
    var slots = tb.getClipLauncherSlots (t);


    if (this.surface.isPressed (MaschineButton.PATTERN))
    {
        if (!slot.hasContent)
        {
            this.createClip (t, s);
            return;
        }
    }
    else if (this.surface.isPressed (MaschineButton.ERASE))
    {
        this.surface.setButtonConsumed (MaschineButton.ERASE);
        slots.select (s);
        this.model.getApplication ().deleteSelection ();
        displayNotification("Remove Clip " + t + ", slot " + s);
        return;
    }


    if (!this.surface.isPressed (MaschineButton.PATTERN))
    {
        AbstractSceneView.prototype.onGridNote.call (this, note, velocity);
    }
    else
    {

        if (!slot.isPlaying)
            slots.launch (s);
        else
            slots.stop ();

        slots.select (s);
    }
};
