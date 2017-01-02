// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// Needs to be overwritten with device specific colors
AbstractSceneView.CLIP_COLOR_IS_RECORDING        = { color: 0, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_RECORDING_QUEUED = { color: 1, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_PLAYING          = { color: 2, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_PLAYING_QUEUED   = { color: 3, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_IS_STOPPING_QUEUED  = { color: 4, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_HAS_CONTENT         = { color: 5, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_NO_CONTENT          = { color: 6, blink: null, fast: false };
AbstractSceneView.CLIP_COLOR_RECORDING_ARMED     = { color: 7, blink: null, fast: false };
AbstractSceneView.USE_CLIP_COLOR                 = true;


function AbstractSceneView (model, rows, columns)
{
    BaseMaschineView.call (this, model);

    this.rows = rows;
    this.columns = columns;

    this.scrollerInterval = Config.sceneScrollInterval;
    this.isTemporary = false;
}
AbstractSceneView.prototype = new BaseMaschineView ();

AbstractSceneView.prototype.onActivate = function ()
{
    BaseMaschineView.prototype.onActivate.call (this);

    this.getCurrentTrackBank ().setIndication (true);
};

AbstractSceneView.prototype.getCurrentTrackBank = function ()
{
    return this.model.sessionTrackBank;
};

AbstractSceneView.prototype.updateArrowStates = function ()
{
    var tb = this.getCurrentTrackBank ();

    BaseMaschineView.prototype.updateArrowStates.call (this);
    this.canScrollUp = tb.canScrollScenesUp ();
    this.canScrollDown = tb.canScrollScenesDown ();
};

// note is expected to be from 36 to 100
AbstractSceneView.prototype.onGridNote = function (note, velocity)
{
    if (velocity == 0)
        return;

    var index = note - 36;
    var t = index % this.columns;
    var s = (this.rows - 1) - Math.floor (index / this.columns);

    var tb = this.getCurrentTrackBank ();
    var slot = tb.getTrack (t).slots[s];
    var slots = tb.getClipLauncherSlots (t);

    if (!this.surface.isSelectPressed ())
    {

        if (tb.getTrack (t).recarm)
        {
            if (slot.isRecording)
                slots.launch (s);
            else
                slots.record (s);
        }
        else
            slots.launch (s);
    }
    slots.select (s);
    
    /* TODO Focus must be on clip launcher!
    
    if (this.surface.isDeletePressed ())
    {
        this.surface.setButtonConsumed (PUSH_BUTTON_DELETE);
        this.model.getApplication ().deleteSelection ();
    }*/
};

AbstractSceneView.prototype.notifyTrackRange = function ()
{
    scheduleTask (doObject (this, function ()
    {
        var message = "Scene Range ";
        var tb = this.getCurrentTrackBank ();
        var first = tb.getTrack (0);
        var last = tb.getTrack (3);
        if (first != null)
            message += "[" + first.name + "]";
        if (last != null)
            message += " -> [" + last.name + "]";
        this.notify (message);
    }), [], 150);
};

AbstractSceneView.prototype.scrollLeft = function (event)
{
    BaseMaschineView.prototype.scrollLeft.call (this, event);
    this.notifyTrackRange ();
};

AbstractSceneView.prototype.scrollRight = function (event)
{
    BaseMaschineView.prototype.scrollRight.call (this, event);
    this.notifyTrackRange ();
};

AbstractSceneView.prototype.scrollUp = function (event)
{
    var tb = this.getCurrentTrackBank ();
    if (this.surface.isShiftPressed ())
        tb.scrollScenesPageUp ();
    else
        tb.scrollScenesUp ();
};

AbstractSceneView.prototype.scrollDown = function (event)
{
    var tb = this.getCurrentTrackBank ();
    if (this.surface.isShiftPressed ())
        tb.scrollScenesPageDown ();
    else
        tb.scrollScenesDown ();
};

AbstractSceneView.prototype.drawGrid = function ()
{
    var tb = this.getCurrentTrackBank ();
    for (var x = 0; x < this.columns; x++)
    {
        var t = tb.getTrack (x);
        for (var y = 0; y < this.rows; y++)
            this.drawPad (t.slots[y], x, y, t.recarm);
    }
};

AbstractSceneView.prototype.drawPad = function (slot, x, y, isArmed)
{
    var color;
    if (slot.isRecording)
    {
        if (slot.isQueued)
        {
            if (AbstractSceneView.USE_CLIP_COLOR && slot.color)
                color = AbstractSceneView.CLIP_COLOR_IS_RECORDING_QUEUED;
            else
                color = AbstractSceneView.CLIP_COLOR_IS_RECORDING_QUEUED;
        }
        else
        {
            // if (AbstractSceneView.USE_CLIP_COLOR && slot.color)
            //    color = { color: BitwigColor.getColor(slot.color), blink: AbstractSceneView.CLIP_COLOR_IS_RECORDING.blink, fast: AbstractSceneView.CLIP_COLOR_IS_RECORDING.fast };
            //else
                color = AbstractSceneView.CLIP_COLOR_IS_RECORDING;
        }
    }
    else if (slot.isPlaying)
    {
        if (slot.isQueued)
        {
            if (AbstractSceneView.USE_CLIP_COLOR && slot.color)
                color = AbstractSceneView.CLIP_COLOR_IS_PLAYING_QUEUED;
            else
                color = AbstractSceneView.CLIP_COLOR_IS_PLAYING_QUEUED;
        }
        else
        {
            //if (AbstractSceneView.USE_CLIP_COLOR && slot.color)
            //    color = { color: BitwigColor.getColor (slot.color), blink: AbstractSceneView.CLIP_COLOR_IS_PLAYING.blink, fast: AbstractSceneView.CLIP_COLOR_IS_PLAYING.fast };
            //else
                color = AbstractSceneView.CLIP_COLOR_IS_PLAYING;
        }
    }
//    else if (!slot.isPlaying && slot.isQueued)
//    {
//        color = AbstractSceneView.CLIP_COLOR_IS_STOPPING_QUEUED;
//    }
    else if (slot.hasContent)
    {
        if (AbstractSceneView.USE_CLIP_COLOR && slot.color)
            color = { color: BitwigColor.getColor (slot.color), blink: AbstractSceneView.CLIP_COLOR_HAS_CONTENT.blink, fast: AbstractSceneView.CLIP_COLOR_HAS_CONTENT.fast };
        else
            color = AbstractSceneView.CLIP_COLOR_HAS_CONTENT;
    }
    else if (isArmed)
        color = AbstractSceneView.CLIP_COLOR_RECORDING_ARMED;
    else
        color = AbstractSceneView.CLIP_COLOR_NO_CONTENT;

    this.surface.pads.lightEx (x, y, color.color, color.blink, color.fast);
};
