// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

AbstractView.prototype.onEnter = function (event) {};

AbstractView.prototype.onShift = function (event)
{
    this.refreshButton (MaschineButton.SHIFT, event);
};


AbstractView.prototype.onBrowse = function (event) {};
AbstractView.prototype.onSampling = function (event) {};

// Arrow Left/Right page Knob pages

//--------------------------------------
// Center Display
//--------------------------------------

AbstractView.prototype.onAll = function () {};
AbstractView.prototype.onAuto = function () {};

//AbstractView.prototype.onFirstRow = function (event, index) {};
//AbstractView.prototype.onValueKnob = function (index, value) {};

AbstractView.prototype.onNoteRepeat = function () {};

//--------------------------------------
// Transport
//--------------------------------------

AbstractView.prototype.onRestart = function (event)
{
    this.refreshButton (MaschineButton.RESTART, event);

    if (!event.isDown ())
        return;

    if (this.surface.isSelectPressed ())
    {
        this.model.getTransport ().stop ();
        this.model.getTransport ().setPosition (0);
    }
    else if (this.surface.isShiftPressed ())
    {
        this.model.getTransport ().toggleLoop ();
    }
    else
        this.model.getTransport ().restart ();
}; // loop

// AbstractView.prototype.onPlay = function (event) {}; Controller Specific

AbstractView.prototype.onRec = function (event)
{
    if (!event.isDown ())
        return;

    if (this.surface.isShiftPressed ())
        this.model.getTransport ().toggleLauncherOverdub ();
    else
        this.model.getTransport ().record ();
};

AbstractView.prototype.showTempo = function ()
{
    var bpm = parseFloat (Math.round (this.model.getTransport ().getTempo () * 100) / 100).toFixed (2);
    this.surface.getDisplay ().showNotification ("Current Tempo:     " + bpm + " BPM");
};

AbstractView.prototype.onGoupButton = function (event, index)
{
    switch (index)
    {
        case 0:
            break;

        case 1:
            break;

        case 2:
            this.onUp (event);
            break;

        case 3:
            if (!this.surface.isActiveView (MaschineStudio.VIEW_EIDT_TOOLS))
            {
                this.surface.setActiveView (MaschineStudio.VIEW_EIDT_TOOLS);
            }
            break;

        case 4:
            break;

        case 5:
            this.onLeft (event);
            break;

        case 6:
            this.onDown (event);
            break;

        case 7:
            this.onRight (event);
            break;
    }
};

AbstractView.prototype.onLeftArrow = function (event)
{
    if (!event.isDown())
        return;
    this.scrollLeft (event);
};

AbstractView.prototype.onRightArrow = function (event)
{
    if (!event.isDown())
        return;
    this.scrollRight (event);
};

//--------------------------------------
// Pads
//--------------------------------------

AbstractView.prototype.onPadMode = function (event) // keyboard
{
    if (event.isLong ())
    {
        this.surface.setActiveMode(Maschine.MODE_SCALE);
        return;
    }

    if (!event.isDown ())
        return;

    if (this.surface.isPressed(MaschineButton.SHIFT))
    {
        this.scales.toggleChromatic ();
        this.notify ("Chromatic     " + this.scales.isChromatic ());
        this.updateScale ();
        return;
    }
    else
    {
        if (this.surface.isActiveMode(Maschine.MODE_SCALE))
        {
            this.surface.setActiveMode(Maschine.MODE_BANK_DEVICE);
            return;
        }
        if (!this.surface.isActiveView (Maschine.VIEW_PLAY))
        {
            this.surface.setActiveView (Maschine.VIEW_PLAY);
        }
    }
};

AbstractView.prototype.onScene = function (event)
{
    if (!event.isDown ())
        return;

    if (!this.surface.isActiveView (Maschine.VIEW_SESSION))
    {
        println("Session View");
        this.surface.setActiveView (Maschine.VIEW_SESSION);
    }
};

AbstractView.prototype.onPattern = function()
{
//    println("Drum View");
//    if (!this.surface.isActiveView (Maschine.VIEW_DRUM))
//    {
//        this.surface.setActiveView (Maschine.VIEW_DRUM);
//    }

};

AbstractView.prototype.onNavigate = function (event)
{
};

AbstractView.prototype.onDuplicate = function (event)
{
};

AbstractView.prototype.onSelect = function (event)
{
};

AbstractView.prototype.onSolo = function (event)
{
};

AbstractView.prototype.onMute = function (event)
{
    this.refreshButton (MaschineButton.MUTE, event);
    if (!event.isDown ())
        return;

    if (this.surface.isActiveMode (Maschine.MODE_BANK_DEVICE))
    {
        this.surface.setPendingMode(Maschine.MODE_TRACK);
        this.notify ("Mode Select...             Track Mode");
    }
    else if (this.surface.isActiveMode (Maschine.MODE_TRACK))
    {
        this.surface.setPendingMode(Maschine.MODE_SCALE);
        this.notify ("Mode Select...             Scale Mode");
    }
    else if (this.surface.isActiveMode (Maschine.MODE_SCALE))
    {
        this.surface.setPendingMode(Maschine.MODE_VOLUME);
        this.notify ("Mode Select...             Volume Mode");
    }
    else if (this.surface.isActiveMode (Maschine.MODE_VOLUME))
    {
        this.surface.setPendingMode(Maschine.MODE_PAN);
        this.notify ("Mode Select...             Pan Mode");
    }
    else if (this.surface.isActiveMode (Maschine.MODE_PAN))
    {
        this.surface.setPendingMode(Maschine.MODE_BANK_DEVICE);
        this.notify ("Mode Select...             Device Mode");
    }

};

//--------------------------------------
// Protected API
//--------------------------------------

AbstractView.prototype.onValueKnob = function (index, value)
{
    // TODO MCU vpot weirdness, need to research this
    if (value == 127)
        return;

    if (value >= 65)
        value = 127 - (value - 64);

    var m = this.surface.getActiveMode ();
    if (m != null)
        m.onValueKnob (index, value);
};

AbstractView.prototype.onFirstRow = function (index)
{
    var m = this.surface.getActiveMode ();
    if (m != null)
        m.onFirstRow (index);
};

AbstractView.prototype.scrollLeft = function (event)
{
    switch (this.surface.getCurrentMode ())
    {
//        case MODE_BANK_DEVICE:
//        case MODE_PRESET:
//            this.model.getCursorDevice ().selectPrevious ();
//            break;

        default:
            var tb = this.model.getCurrentTrackBank ();
            var sel = tb.getSelectedTrack ();
            var index = sel == null ? 0 : sel.index - 1;
            if (index == -1 || this.surface.isShiftPressed ())
            {
                if (!tb.canScrollTracksUp ())
                    return;
                tb.scrollTracksPageUp ();
                var newSel = index == -1 || sel == null ? 3 : sel.index;
                scheduleTask (doObject (this, this.selectTrack), [ newSel ], 75);
                return;
            }
            this.selectTrack (index);
            break;
    }
};

AbstractView.prototype.scrollRight = function (event)
{
    switch (this.surface.getCurrentMode ())
    {
//        case MODE_BANK_DEVICE:
//        case MODE_PRESET:
//            this.model.getCursorDevice ().selectNext ();
//            break;

        default:
            var tb = this.model.getCurrentTrackBank ();
            var sel = tb.getSelectedTrack ();
            var index = sel == null ? 0 : sel.index + 1;
            if (index == 4 || this.surface.isShiftPressed ())
            {
                if (!tb.canScrollTracksDown ())
                    return;
                tb.scrollTracksPageDown ();
                var newSel = index == 4 || sel == null ? 0 : sel.index;
                scheduleTask (doObject (this, this.selectTrack), [ newSel ], 75);
                return;
            }
            this.selectTrack (index);
            break;
    }
};

AbstractDisplay.NOTIFICATION_TIME = 500; // ms

AbstractView.prototype.notify = function (message)
{
    this.surface.getDisplay().showNotification (message);
};

AbstractView.prototype.updateScale = function ()
{
    this.surface.getActiveView ().updateNoteMapping ();
    //Config.setScale (this.scales.getName (this.scales.getSelectedScale ()));
    //Config.setScaleBase (Scales.BASES[this.scales.getScaleOffset ()]);
    //Config.setScaleInScale (!this.scales.isChromatic ());
};

AbstractView.prototype.canSelectedTrackHoldNotes = function ()
{
    var t = this.model.getCurrentTrackBank ().getSelectedTrack ();
    return t != null && t.canHoldNotes;
};

AbstractView.prototype.clearPressedKeys = function ()
{
    for (var i = 0; i < 128; i++)
        this.pressedKeys[i] = 0;
};

AbstractView.prototype.refreshButton = function (buttonId, event)
{
    this.surface.setButton (buttonId, event.isDown () || event.isLong ()
        ? MaschineButton.STATE_DOWN : MaschineButton.STATE_UP);
};
