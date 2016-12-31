// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

//--------------------------------------
// Main Section
//--------------------------------------

// MK2, MIKRO
AbstractView.prototype.onControl = function (event)
{
    this.refreshButton (MaschineButton.CONTROL, event);
};

AbstractView.prototype.onStepMode = function (event)
{
    this.refreshButton (MaschineButton.STEP_MODE, event);

    if (!event.isDown())
        return;

    if (!this.surface.isActiveView (Maschine.VIEW_SEQUENCER))
    {
        this.surface.setActiveView (Maschine.VIEW_SEQUENCER);
    }
};

AbstractView.prototype.onBrowse = function (event)
{
    this.refreshButton (MaschineButton.BROWSE, event);

    if (!event.isDown ())
        return;

    if (this.surface.isShiftPressed ())
    {
        this.model.getApplication ().toggleBrowserVisibility ();
        return;
    }

    if (Maschine.isDeviceMode (this.surface.getActiveMode ().getId ()))
    {
        if (!this.surface.isActiveMode (Maschine.MODE_PRESET))
        {
            this.surface.setPreviousModeId (this.surface.getActiveMode ().getId ());
            this.surface.setPendingMode (Maschine.MODE_PRESET);
        }
    }
    else if (this.surface.isActiveMode (Maschine.MODE_PRESET))
    {
        this.surface.setPendingMode ( this.surface.getPreviousModeId ());
    }
};

AbstractView.prototype.onSampling = function (event)
{
    this.refreshButton (MaschineButton.SAMPLING, event);

    if (event.isDown ())
        return;

    if (event.isLong ())
    {
        this.surface.setPendingMode (Maschine.MODE_FRAME);
        return;
    }

    if (this.surface.isActiveMode (Maschine.MODE_FRAME))
    {
        this.surface.restoreMode ();
        return;
    }

    var layout = this.model.getApplication ().getPanelLayout ();
    if (layout == 'ARRANGE')
        layout = 'MIX';
    else if (layout == 'MIX')
        layout = 'EDIT';
    else if (layout == 'EDIT')
        layout = 'ARRANGE';

    this.model.getApplication ().setPanelLayout (layout);
};

AbstractView.prototype.onAll = function (event)
{
};

AbstractView.prototype.onAuto = function (event)
{
    this.refreshButton (MaschineButton.AUTO, event);

    if (!event.isDown ())
        return;

    if (this.surface.isSelectPressed ())
    {
        this.model.getTransport ().resetAutomationOverrides ();
        return;
    }

    var selectedTrack = this.model.getCurrentTrackBank ().getSelectedTrack ();

    var layout = this.model.getApplication ().getPanelLayout ()
    var shiftPressed = this.surface.isShiftPressed ();

    if (layout == 'ARRANGE')
    {
        if (shiftPressed)
            this.model.getTransport ().toggleWriteClipLauncherAutomation ();
        else if (selectedTrack != null)
            this.model.getTransport ().toggleWriteArrangerAutomation ();
    }
    else  if (layout == 'MIX' || layout == 'EDIT')
    {
        if (!shiftPressed)
            this.model.getTransport ().toggleWriteClipLauncherAutomation ();
        else
            this.model.getTransport ().toggleWriteArrangerAutomation ();
    }
};

//--------------------------------------
// Master Section
//--------------------------------------

// MK2
AbstractView.prototype.onVolume = function (event)
{
};

// MK2
AbstractView.prototype.onSwing = function (event)
{
};

// MK2
AbstractView.prototype.onTempo = function (event)
{
    this.refreshButton (MaschineMK2Button.TEMPO, event);
    if (event.isLong ())
        return;

    if (event.isDown ())
    {
        if (!this.surface.isActiveMode (Maschine.MODE_TEMPO))
        {
            this.surface.setPendingMode (Maschine.MODE_TEMPO);
        }
    }
    else
    {
        this.surface.restoreMode ();
    }
};

AbstractView.prototype.onNoteRepeat = function () {};

AbstractView.prototype.onJogWheelInternal = function (increase)
{
    increase = increase <= 64 ? true : false;
    if (this.model.hasSelectedDevice ())
    {
        var cursorDevice = this.model.getCursorDevice ();
        if (this.surface.isActiveMode (Maschine.MODE_BANK_DEVICE))
        {
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

            scheduleTask(doObject(this, function ()
            {
                this.notifyBankChange ();
            }), null, 300);

        }
        else if (this.surface.isActiveMode (Maschine.MODE_PRESET))
        {
            if (!increase)
            {
                cursorDevice.switchToPreviousPreset ();
            }
            else
            {
                cursorDevice.switchToNextPreset ();
            }
        }
    }
};

// MK2
AbstractView.prototype.onMasterLeftArrow = function (event)
{
};

// MK2
AbstractView.prototype.onMasterRightArrow = function (event)
{
};

AbstractView.prototype.onEnter = function (event) {};

//--------------------------------------
// Groups Section
//--------------------------------------

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
            if (!event.isLong ())
                this.surface.lightColor (MaschineButton.GROUP_D, event.isDown () ? COLOR.ON : COLOR.ON_DIM);
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

//--------------------------------------
// Transport Section
//--------------------------------------

AbstractView.prototype.onRestart = function (event)
{
    this.refreshButton (MaschineButton.RESTART, event);

    if (!event.isDown ())
        return;

    if (this.surface.isCtrlPressed ())
    {
        this.model.getTransport ().stop ();
        this.model.getTransport ().setPosition (0);
    }
    else if (this.surface.isShiftPressed ())
    {
        this.model.getTransport ().toggleLoop ();
    }
    else
    {
        this.model.getTransport ().restart ();
    }
};

AbstractView.prototype.onLeftArrow = function (event)
{
    if (this.surface.isPressed (MaschineButton.GRID))
    {
        this.onDeviceLeft (event);
        return;
    }

    if (!event.isDown())
        return;

    this.model.getCursorDevice ().selectPrevious ();
//    if (Maschine.isDeviceMode (this.surface.getCurrentMode ()))
//    {
//        this.model.getCursorDevice ().selectPrevious ();
//    }
//    else
//    {
//        this.scrollLeft (event);
//    }
};

AbstractView.prototype.onRightArrow = function (event)
{
    if (this.surface.isPressed (MaschineButton.GRID))
    {
        this.onDeviceRight (event);
        return;
    }

    if (!event.isDown())
        return;

    this.model.getCursorDevice ().selectNext ();
//    if (Maschine.isDeviceMode (this.surface.getCurrentMode ()))
//    {
//        this.model.getCursorDevice ().selectNext ();
//    }
//    else
//    {
//        this.scrollRight (event);
//    }
};

AbstractView.prototype.onGrid = function (event)
{
    //this.refreshButton (MaschineButton.GRID, event);
};

AbstractView.prototype.onPlay = function (event) {};

AbstractView.prototype.onRec = function (event)
{
    if (!event.isDown ())
        return;

    var layout = this.model.getApplication ().getPanelLayout ()
    var shiftPressed = this.surface.isShiftPressed ();

    if (layout == 'ARRANGE')
    {
        if (shiftPressed)
            this.model.getTransport ().toggleLauncherOverdub ();
        else
            this.model.getTransport ().record ();
    }
    else  if (layout == 'MIX' || layout == 'EDIT')
    {
        if (!shiftPressed)
            this.model.getTransport ().toggleLauncherOverdub ();
        else
            this.model.getTransport ().record ();
    }
};

AbstractView.prototype.onErase = function (event)
{
//    if (event.isUp ())
//        this.model.getApplication ().deleteSelection ();
};

//--------------------------------------
// Pads Section
//--------------------------------------

AbstractView.prototype.onScene = function (event)
{
    this.refreshButton (MaschineButton.SCENE, event);

    if (event.isLong ())
        return;

    if (event.isDown ())
        this.surface.setPendingMode (Maschine.MODE_SCENE_TRIGGER);
    else
        this.surface.restoreMode ();

    if (!this.surface.isActiveView (Maschine.VIEW_SCENE_TRIGGER))
        this.surface.setActiveView (Maschine.VIEW_SCENE_TRIGGER);
};

AbstractView.prototype.onPattern = function(event)
{
    this.refreshButton (MaschineButton.PATTERN, event);

    if (event.isLong ())
        return;

    if (event.isDown ())
        this.surface.setPendingMode (Maschine.MODE_CLIP_TRIGGER);
    else
        this.surface.restoreMode ();

    if (!this.surface.isActiveView (Maschine.VIEW_CLIP_TRIGGER))
        this.surface.setActiveView (Maschine.VIEW_CLIP_TRIGGER);
};

AbstractView.prototype.onPadMode = function (event) // keyboard
{
    this.refreshButton (MaschineButton.PAD_MODE, event);

    if (!event.isDown ())
        return;

    // If the view is STEP, just send it straight back to DRUM
    if (this.surface.isActiveView (Maschine.VIEW_SEQUENCER))
    {
        this.surface.setActiveView (Maschine.VIEW_DRUM);
    }
    else if (!this.surface.isActiveView (Maschine.VIEW_PLAY))
    {
        this.surface.setActiveView (Maschine.VIEW_PLAY);
    }
    else if (this.surface.isActiveView (Maschine.VIEW_PLAY))
    {
        this.surface.setActiveView (Maschine.VIEW_DRUM);
    }
};

AbstractView.prototype.onNavigate = function (event)
{
    this.refreshButton (MaschineButton.NAVIGATE, event);

    if (event.isLong ())
        return;

    if (this.surface.isPressed (MaschineButton.GROUP_D))
    {
        this.onNavigateAction (event);
        return;
    }

    // TODO refactor temp variable
    if (event.isDown ())
    {
        if (!this.surface.isActiveView (Maschine.VIEW_MODE))
        {
            this.surface._previousViewId = this.surface.activeViewId;
            this.surface.setPreviousModeId (this.surface.getActiveMode ().getId ());
            this.surface.setActiveView (Maschine.VIEW_MODE);
            this.surface.setPendingMode (Maschine.MODE_SELECT);
        }
    }
    else
    {
        this.surface.setActiveView (this.surface._previousViewId);
        if (Maschine.isDeviceMode (this.surface.getPreviousModeId ()))
            this.surface.getMode (Maschine.MODE_PARAM_PAGE_SELECT).setCurrentMode (this.surface.getPreviousModeId ());
        this.surface.setPendingMode (this.surface.getPreviousModeId ());
        this.notifyModeChange (this.surface.getPreviousModeId ());
    }
};

AbstractView.prototype.onDuplicate = function (event)
{
    if (event.isDown ())
        this.model.getApplication ().duplicate ();
};

AbstractView.prototype.onSelect = function (event)
{
    this.refreshButton (MaschineButton.SELECT, event);

    if (event.isLong ())
        return;

    // [SELECT] + StepSequencerView, allow drum track selection
    if (this.surface.isActiveView (Maschine.VIEW_SEQUENCER) || this.surface._tempDrumSelect)
    {
        if (event.isDown ())
        {
            this.surface._tempDrumSelect = true;
            this.surface.setActiveView (Maschine.VIEW_DRUM);
        }
        else
        {
            this.surface.setActiveView (Maschine.VIEW_SEQUENCER);
            this.surface._tempDrumSelect= false;
        }
        return;
    }

    // [D + SELECT] navigate for next device bank mode
    // Will also catch when [D] was released BEFORE [SELECT] and revert to last mode
    if (this.surface.isPressed (MaschineButton.GROUP_D) ||
        this.surface.isActiveMode (Maschine.MODE_PARAM_PAGE_SELECT))
    {
        if (event.isDown ())
        {
            if (Maschine.isDeviceMode (this.surface.getActiveMode ().getId ()))
            {
                this.surface.setPreviousModeId (this.surface.getActiveMode().getId());
                this.surface.setPendingMode(Maschine.MODE_PARAM_PAGE_SELECT);
            }
        }
        else
        {
            if (this.surface._previousDeviceBankModeId == null)
            {
                this.surface.setPendingMode (this.surface.getPreviousModeId ());
            }
            else
            {
                this.surface.setPendingMode (this.surface._previousDeviceBankModeId);
                this.surface._previousDeviceBankModeId = null;
            }
            this.notifyModeChange ();
        }
        return;
    }

    // [SELECT] Up && TrackView - Revert to previous view and mode
    if (!event.isDown () && this.surface.isActiveView (Maschine.VIEW_TRACK))
    {
        this.surface.setActiveView (this.surface._previousViewId);
        this.surface.setPendingMode (this.surface.getPreviousModeId ());
        return;
    }

    // [SELECT] Select current Track
    if (event.isDown ())
    {
        this.surface._previousViewId = this.surface.activeViewId;
        this.surface.setPreviousModeId (this.surface.getActiveMode().getId());
        this.surface.setActiveView (Maschine.VIEW_TRACK);
        this.surface.setPendingMode (Maschine.MODE_TRACK_VIEW);
    }
};

AbstractView.prototype.onSolo = function (event)
{
    this.refreshButton (MaschineButton.SOLO, event);
    if (event.isLong ())
        return;

    if (this.surface.isActiveView (Maschine.VIEW_DRUM))
    {
        if (event.isDown ())
        {
            this.surface.getActiveView ().updateNoteMapping ();
            this.surface.setPendingMode (Maschine.MODE_DRUM_CHANNEL);
        }
        else
        {
            this.surface.restoreMode ();
        }
        return;
    }

    if (event.isDown ())
    {
        if (!this.surface.isActiveView (Maschine.VIEW_SOLO))
        {
            this.surface._previousViewId = this.surface.activeViewId;
            this.surface.setPreviousModeId (this.surface.getActiveMode ().getId ());
            this.surface.setActiveView (Maschine.VIEW_SOLO);
            this.surface.setPendingMode (Maschine.MODE_VOLUME);
        }
    }
    else
    {
        this.surface.setActiveView (this.surface._previousViewId);
        this.surface.setPendingMode (this.surface.getPreviousModeId ());
    }
};

AbstractView.prototype.onMute = function (event)
{
    this.refreshButton (MaschineButton.MUTE, event);
    if (event.isLong ())
        return;

    if (this.surface.isActiveView (Maschine.VIEW_DRUM))
    {
        if (event.isDown ())
        {
            this.surface.getActiveView ().updateNoteMapping ();
            this.surface.setPendingMode (Maschine.MODE_DRUM_CHANNEL);
        }
        else
        {
            this.surface.restoreMode ();
        }
        return;
    }

    if (event.isDown ())
    {
        if (!this.surface.isActiveView (Maschine.VIEW_MUTE))
        {
            this.surface._previousViewId = this.surface.activeViewId;
            this.surface.setPreviousModeId (this.surface.getActiveMode ().getId ());
            this.surface.setActiveView (Maschine.VIEW_MUTE);
            this.surface.setPendingMode (Maschine.MODE_VOLUME);
        }
    }
    else
    {
        this.surface.setActiveView (this.surface._previousViewId);
        this.surface.setPendingMode (this.surface.getPreviousModeId ());
    }
};

//--------------------------------------
// Protected API
//--------------------------------------

AbstractView.prototype.onShift = function (event)
{
    this.refreshButton (MaschineButton.SHIFT, event);
};

//AbstractView.prototype.onFirstRow = function (event, index) {};
//AbstractView.prototype.onValueKnob = function (index, value) {};

AbstractView.prototype.onDeviceLeft = function (event)
{
    if (!event.isDown ())
        return;

    var cd = this.model.getCursorDevice ();
    if (!cd.hasSelectedDevice ())
        return;

    if (!cd.hasLayers ())
        return;

    var displaysDevice = this.surface.getCurrentMode () == Maschine.MODE_BANK_DEVICE;
    var dl = cd.getSelectedLayer ();
    if (displaysDevice)
    {
        if (dl == null)
            cd.selectLayer (0);
    }
    else
    {
        if (dl != null)
            cd.selectFirstDeviceInLayer (dl.index);
    }
    this.surface.setPendingMode (displaysDevice ? Maschine.MODE_DEVICE_LAYER : Maschine.MODE_BANK_DEVICE);
};

AbstractView.prototype.onDeviceRight = function (event)
{
    var isDeviceMode = this.surface.getCurrentMode () == Maschine.MODE_BANK_DEVICE;
    this.surface.setPendingMode (isDeviceMode ? Maschine.MODE_DEVICE_LAYER : Maschine.MODE_BANK_DEVICE);
    if (isDeviceMode)
    // TODO FIX Required - No way to check if we are on the top of the device tree
        this.model.getCursorDevice ().selectParent ();
    else
    // TODO Create a function
        this.model.getCursorDevice ().cursorDevice.getChannel ().selectInEditor();
};

AbstractView.prototype.doNavigateAction = function (index)
{
    switch (index)
    {
        case 0:
            this.model.getApplication ().undo ();
            break;

        case 1:
            this.model.getApplication ().redo ();
            break;

        case 4:
            this.model.getApplication ().quantize ();
            break;

        case 8:
            this.model.getApplication ().deleteSelection ();
            break;

        case 14:
            if (this.surface.isActiveView (Maschine.VIEW_PLAY))
                this.surface.getActiveView ().onDown (new ButtonEvent (ButtonEvent.DOWN));
            break;

        case 15:
            if (this.surface.isActiveView (Maschine.VIEW_PLAY))
                this.surface.getActiveView ().onUp (new ButtonEvent (ButtonEvent.DOWN));
            break;
    }
};

AbstractView.prototype.onNavigateAction = function (event)
{
    if (event.isLong ())
        return;

    if (event.isDown ())
    {
        // println("NavigateAction down");
        if (!this.surface.isActiveView (Maschine.VIEW_NAVIGATE_ACTION))
        {
            this.surface._previousViewId = this.surface.activeViewId;
            this.surface.setActiveView (Maschine.VIEW_NAVIGATE_ACTION);
        }
    }
    else
    {
        //println("NavigateAction up");
        this.surface.setActiveView (this.surface._previousViewId);
    }
};

AbstractView.prototype.createClip = function (trackIndex, slotIndex)
{
    var tb = this.model.sessionTrackBank;
    var t = tb.getTrack (trackIndex);
    if (t != null)
    {
        var slots = tb.getClipLauncherSlots (t.index);
        slots.createEmptyClip (slotIndex, Math.pow (2, Config.newClipLengthIndex));
        tb.showClipInEditor (trackIndex, slotIndex);
    }
};

AbstractView.prototype.onNew = function (event)
{
    if (!event.isDown ())
        return;
    var tb = this.getCurrentTrackBank ();
    var t = tb.getSelectedTrack ();
    if (t != null)
    {
        var slotIndexes = tb.getSelectedSlots (t.index);
        var slotIndex = slotIndexes.length == 0 ? 0 : slotIndexes[0].index;
        for (var i = 0; i < 4; i++)
        {
            var sIndex = (slotIndex + i) % 4;
            var s = t.slots[sIndex];
            if (!s.hasContent)
            {
                var slots = tb.getClipLauncherSlots (t.index);
                slots.createEmptyClip (sIndex, Math.pow (2, Config.newClipLengthIndex));
                if (slotIndex != sIndex)
                    slots.select (sIndex);
                slots.launch (sIndex);
                this.model.getTransport ().setLauncherOverdub (true);
                return;
            }
        }
    }
    displayNotification ("In the current selected grid view there is no empty slot. Please scroll down.");
};

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

AbstractView.prototype.onValueKnobTouch = function (index, isTouched)
{
    var m = this.surface.getActiveMode ();
    if (m != null)
        m.onValueKnobTouch (index, isTouched);
};

AbstractView.prototype.onFirstRow = function (index)
{
    var m = this.surface.getActiveMode ();
    if (m != null)
        m.onFirstRow (index);
};

AbstractView.prototype.getCurrentTrackBank = function ()
{
    return this.surface.isActiveView (Maschine.VIEW_CLIP_TRIGGER) ?
        this.model.sessionTrackBank : this.model.getCurrentTrackBank ();
};

AbstractView.prototype.getCurrentTrackBankLength = function ()
{
    return this.surface.isActiveView (Maschine.VIEW_CLIP_TRIGGER) ?
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
        case Maschine.MODE_DEVICE_LAYER:
            var cd = this.model.getCursorDevice ();
            var sel = cd.getSelectedLayer ();
            var index = sel == null ? 0 : sel.index - 1;
            if (index == -1 || this.surface.isShiftPressed ())
            {
                if (!cd.canScrollLayersUp ())
                    return;
                cd.scrollLayersPageUp ();
                var newSel = index == -1 || sel == null ? 7 : sel.index;
                scheduleTask (doObject (this, this.selectLayer), [ newSel ], 75);
                return;
            }
            this.selectLayer (index);
            break;

        default:
            this.scrollTrackLeft (event);
            break;
    }
};

AbstractView.prototype.scrollRight = function (event)
{
    switch (this.surface.getCurrentMode ())
    {
        case Maschine.MODE_DEVICE_LAYER:
            var cd = this.model.getCursorDevice ();
            var sel = cd.getSelectedLayer ();
            var index = sel == null ? 0 : sel.index + 1;
            if (index == 8 || this.surface.isShiftPressed ())
            {
                if (!cd.canScrollLayersDown ())
                    return;
                cd.scrollLayersPageDown ();
                var newSel = index == 8 || sel == null ? 0 : sel.index;
                scheduleTask (doObject (this, this.selectLayer), [ newSel ], 75);
                return;
            }
            this.selectLayer (index);
            break;

        default:
            this.scrollTrackRight (event);
            break;
    }
};

AbstractView.prototype.selectLayer = function (index)
{
    this.model.getCursorDevice ().selectLayer (index);
};

AbstractDisplay.NOTIFICATION_TIME = 500; // ms

AbstractView.prototype.notify = function (message)
{
    this.surface.getDisplay().showNotificationLeft (message, "", 750);
};

AbstractView.prototype.notifyBankChange = function ()
{
    //if (!Config.modeNotify)
    //    return;
    this.surface.getDisplay().showNotificationLeft ("Selected Parameter Bank:",
        this.model.getCursorDevice ().getSelectedParameterPageName (), 1000);
};

AbstractView.prototype.notifyModeChange = function (modeId)
{
    if (!Config.modeNotify)
        return;
    this.surface.getDisplay().showNotificationLeft ("Mode Selected:", Maschine.getModeName (modeId) + " Mode", 1000);
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
    this.surface.lightButton (buttonId, event.isDown () || event.isLong ());
};

AbstractView.prototype.showTempo = function ()
{
    var bpm = parseFloat (Math.round (this.model.getTransport ().getTempo () * 100) / 100).toFixed (2);
    this.surface.getDisplay ().showNotificationLeft ("Current Tempo:", bpm + " BPM", 1000);
};

AbstractView.prototype.updateArrowStates = function ()
{
    switch (this.surface.getCurrentMode ())
    {
        case Maschine.MODE_BANK_DEVICE:
        case Maschine.MODE_PRESET:
            var cd = this.model.getCursorDevice ();
            this.canScrollLeft = cd.canSelectPreviousFX ();
            this.canScrollRight = cd.canSelectNextFX ();
            break;

        case Maschine.MODE_DEVICE_LAYER:
            var cd = this.model.getCursorDevice ();
            this.canScrollLeft = cd.canScrollLayersDown ();
            this.canScrollRight = cd.canScrollLayersUp ();
            break;

        default:
            var tb = this.model.getCurrentTrackBank ();
            var sel = tb.getSelectedTrack ();
            this.canScrollLeft = sel != null && sel.index > 0 || tb.canScrollTracksUp ();
            this.canScrollRight = sel != null && sel.index < 7 || tb.canScrollTracksDown ();
            break;
    }
};

AbstractView.prototype.updateArrows = function ()
{
    this.updateArrowStates ();
    this.surface.lightColor (MaschineButton.ARROW_LEFT, this.getColorArrowState (this.canScrollLeft));
    this.surface.lightColor (MaschineButton.ARROW_RIGHT, this.getColorArrowState (this.canScrollRight));
    this.surface.lightColor (MaschineButton.ARROW_UP, this.getColorArrowState (this.canScrollUp));
    this.surface.lightColor (MaschineButton.ARROW_DOWN, this.getColorArrowState (this.canScrollDown));
};

AbstractView.prototype.getColorArrowState = function (isOn)
{
    return isOn ? COLOR.AQUA : COLOR.AQUA_OFF;
};
