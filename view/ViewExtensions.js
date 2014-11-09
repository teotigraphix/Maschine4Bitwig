// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

AbstractView.prototype.onEnter = function (event) {};

AbstractView.prototype.onShift = function (event)
{
    this.refreshButton (MaschineButton.SHIFT, event);
};

AbstractView.prototype.onBrowse = function (event)
{
    this.refreshButton (MaschineButton.BROWSE, event);

    if (!event.isDown ())
        return;

    if (this.surface.isActiveMode (Maschine.MODE_BANK_DEVICE))
    {
        if (!this.surface.isActiveMode (Maschine.MODE_PRESET))
        {
            this.surface.setPendingMode (Maschine.MODE_PRESET);
        }
    }
    else if (this.surface.isActiveMode (Maschine.MODE_PRESET))
    {
        this.surface.setPendingMode (Maschine.MODE_BANK_DEVICE);
    }
};

AbstractView.prototype.onSampling = function (event)
{
    this.refreshButton (MaschineButton.SAMPLING, event);

    if (!event.isDown ())
        return;

    var layout = this.model.getApplication ().getPanelLayout ();
    if (layout == 'ARRANGE')
        layout = 'MIX';
    else if (layout == 'MIX')
        layout = 'EDIT';
    else if (layout == 'EDIT')
        layout = 'ARRANGE';

    this.model.getApplication ().setPanelLayout (layout);
};

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

    switch (this.surface.getCurrentMode ())
    {
        case Maschine.MODE_BANK_DEVICE:
        case Maschine.MODE_PRESET:
            this.model.getCursorDevice ().selectPrevious ();
            break;
        default:
            this.scrollLeft (event);
    }
};

AbstractView.prototype.onRightArrow = function (event)
{
    if (!event.isDown())
        return;

    switch (this.surface.getCurrentMode ())
    {
        case Maschine.MODE_BANK_DEVICE:
        case Maschine.MODE_PRESET:
            this.model.getCursorDevice ().selectNext ();
            break;
        default:
            this.scrollRight (event);
    }
};

//--------------------------------------
// Pads
//--------------------------------------

AbstractView.prototype.onPadMode = function (event) // keyboard
{
    if (!event.isDown ())
        return;

    if (!this.surface.isActiveView (Maschine.VIEW_PLAY))
    {
        this.surface.setActiveView (Maschine.VIEW_PLAY);
    }
};

AbstractView.prototype.onScene = function (event)
{
    if (!event.isDown ())
        return;

    if (!this.surface.isActiveView (Maschine.VIEW_SESSION))
    {
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
    this.refreshButton (MaschineButton.NAVIGATE, event);

    if (event.isLong ())
        return;

    // TODO refactor temp variable
    if (event.isDown ())
    {
        if (!this.surface.isActiveView (Maschine.VIEW_MODE))
        {
            this.surface._previousViewId = this.surface.activeViewId;
            this.surface._previousModeId = this.surface.getActiveMode ().getId ();
            this.surface.setActiveView (Maschine.VIEW_MODE);
            this.surface.setPendingMode (Maschine.MODE_SELECT);
        }
    }
    else
    {
        this.surface.setActiveView (this.surface._previousViewId);
        this.surface.setPendingMode (this.surface._previousModeId);
        this.notifyModeChange (this.surface._previousModeId);
    }
};

AbstractView.prototype.onDuplicate = function (event)
{
};

AbstractView.prototype.onSelect = function (event)
{
    this.refreshButton (MaschineButton.SELECT, event);
    if (event.isLong ())
        return;

    if (event.isDown ())
    {
        if (this.surface.isActiveMode (Maschine.MODE_BANK_DEVICE))
        {
            this.surface.setPendingMode (Maschine.MODE_PARAM_PAGE_SELECT);
        }
        else if (Maschine.isDeviceBankMode (this.surface.getActiveMode ().getId ()) ||
                 this.surface.isActiveMode (Maschine.MODE_PARAM_PAGE_SELECT))
        {
            this.surface.setPendingMode (Maschine.MODE_BANK_DEVICE);
        }
    }
    else
    {
        if (this.surface.isActiveMode (Maschine.MODE_PARAM_PAGE_SELECT))
        {
            //this.surface.setPendingMode (Maschine.MODE_BANK_DEVICE);
        }
    }
};

AbstractView.prototype.onSolo = function (event)
{
    this.refreshButton (MaschineButton.SOLO, event);
    if (event.isLong ())
        return;

    if (event.isDown ())
    {
        if (!this.surface.isActiveView (Maschine.VIEW_SOLO))
        {
            this.surface._previousViewId = this.surface.activeViewId;
            this.surface._previousModeId = this.surface.getActiveMode ().getId ();
            this.surface.setActiveView (Maschine.VIEW_SOLO);
            this.surface.setPendingMode (Maschine.MODE_VOLUME);
        }
    }
    else
    {
        this.surface.setActiveView (this.surface._previousViewId);
        this.surface.setPendingMode (this.surface._previousModeId);
    }
};

AbstractView.prototype.onMute = function (event)
{
    this.refreshButton (MaschineButton.MUTE, event);
    if (event.isLong ())
        return;

    if (event.isDown ())
    {
        if (!this.surface.isActiveView (Maschine.VIEW_MUTE))
        {
            this.surface._previousViewId = this.surface.activeViewId;
            this.surface._previousModeId = this.surface.getActiveMode ().getId ();
            this.surface.setActiveView (Maschine.VIEW_MUTE);
            this.surface.setPendingMode (Maschine.MODE_VOLUME);
        }
    }
    else
    {
        this.surface.setActiveView (this.surface._previousViewId);
        this.surface.setPendingMode (this.surface._previousModeId);
    }
};

AbstractView.prototype.onJogWheelInternal = function (increase)
{
    if (this.surface.isShiftPressed ())
    {
        if (this.surface.isActiveMode (Maschine.MODE_BANK_DEVICE) &&
            this.model.hasSelectedDevice ())
        {
            var cursorDevice = this.model.getCursorDevice ();
            if (!increase)
            {
                if (cursorDevice.hasPreviousParameterPage ())
                    cursorDevice.previousParameterPage ();
            }
            else
            {
                if (cursorDevice.hasNextParameterPage ())
                    cursorDevice.nextParameterPage ();
            }

            this.notify ("Selected Parameter Bank " + cursorDevice.getSelectedParameterPageName ());
        }
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

AbstractView.prototype.getCurrentTrackBank = function ()
{
    return this.surface.isActiveView (Maschine.VIEW_SESSION) ?
        this.model.sessionTrackBank : this.model.getCurrentTrackBank ();
};

AbstractView.prototype.getCurrentTrackBankLength = function ()
{
    return this.surface.isActiveView (Maschine.VIEW_SESSION) ?
        4 : 8;
};

AbstractView.prototype.selectTrack = function (index)
{
    this.getCurrentTrackBank ().select (index);
};

AbstractView.prototype.scrollTrackLeft = function (event)
{
    var tb = this.getCurrentTrackBank ();
    var sel = tb.getSelectedTrack ();
    var index = sel == null ? 0 : sel.index - 1;
    if (index == -1 || this.surface.isShiftPressed ())
    {
        if (!tb.canScrollTracksUp ())
            return;
        tb.scrollTracksPageUp ();
        var newSel = index == -1 || sel == null ? this.getCurrentTrackBankLength () - 1 : sel.index;
        scheduleTask (doObject (this, this.selectTrack), [ newSel ], 150);
        return;
    }
    this.selectTrack (index);
};

AbstractView.prototype.scrollTrackRight = function (event)
{
    var tb = this.getCurrentTrackBank ();
    var sel = tb.getSelectedTrack ();
    var index = sel == null ? 0 : sel.index + 1;
    if (index == this.getCurrentTrackBankLength () || this.surface.isShiftPressed ())
    {
        if (!tb.canScrollTracksDown ())
            return;
        tb.scrollTracksPageDown ();
        var newSel = index == this.getCurrentTrackBankLength () || sel == null ? 0 : sel.index;
        scheduleTask (doObject (this, this.selectTrack), [ newSel ], 150);
        return;
    }
    this.selectTrack (index);
};

AbstractView.prototype.scrollLeft = function (event)
{
    switch (this.surface.getCurrentMode ())
    {
        default:
            this.scrollTrackLeft (event);
            break;
    }
};

AbstractView.prototype.scrollRight = function (event)
{
    switch (this.surface.getCurrentMode ())
    {
        default:
            this.scrollTrackRight (event);
            break;
    }
};

AbstractDisplay.NOTIFICATION_TIME = 500; // ms

AbstractView.prototype.notify = function (message)
{
    this.surface.getDisplay().showNotification (message);
};

AbstractView.prototype.notifyModeChange = function (modeId)
{
    this.notify ("Mode Select  " + Maschine.getModeName (modeId) + " Mode");
};

AbstractView.prototype.updateScale = function ()
{
    this.surface.getActiveView ().updateNoteMapping ();
    Config.setScale (this.scales.getName (this.scales.getSelectedScale ()));
    Config.setScaleBase (Scales.BASES[this.scales.getScaleOffset ()]);
    Config.setScaleInScale (!this.scales.isChromatic ());
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
