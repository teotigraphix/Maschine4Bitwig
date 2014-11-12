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

AbstractView.prototype.onAll = function (event)
{
};

AbstractView.prototype.onAuto = function (event)
{
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

AbstractView.prototype.onGrid = function (event)
{
    this.refreshButton (MaschineButton.GRID, event);
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

AbstractView.prototype.onDeviceLeft = function (event)
{
    if (!event.isDown ())
        return;

    // TODO FIX The returned channel selection does not contain the layers instead it is the top level tracks selection
    var cd = this.model.getCursorDevice ();
    if (cd.hasSelectedDevice ())
    {
        if (cd.hasLayers ())
            this.surface.setPendingMode (this.surface.getCurrentMode () == Maschine.MODE_BANK_DEVICE ?
                Maschine.MODE_DEVICE_LAYER : Maschine.MODE_BANK_DEVICE);
    }
    else
    {
        this.model.getCursorDevice ().cursorDevice.selectFirstInLayer (0);
    }
};

AbstractView.prototype.onDeviceRight = function (event)
{
    if (event.isDown ())   // TODO Create function in CursorDeviceProxy when API is fully working and tested
        this.model.getCursorDevice ().cursorDevice.selectParent ();
};

AbstractView.prototype.onLeftArrow = function (event)
{
    if (this.surface.isPressed (MaschineButton.GRID))
    {
        println("onLeftArrow(0");
        this.onDeviceLeft (event);
        return;
    }

    if (!event.isDown())
        return;

    if (this.surface.isShiftPressed ())
    {
        var device = this.model.getCursorDevice ();
        switch (this.surface.getCurrentMode ())
        {
            case Maschine.MODE_BANK_DEVICE:
                if (device.hasPreviousParameterPage ())
                    device.previousParameterPage ();

                this.notifyBankChange ();
                break;
        }
    }
    else
    {
        if (Maschine.isDeviceMode (this.surface.getCurrentMode ()))
        {
            this.model.getCursorDevice ().selectPrevious ();
        }
        else
        {
            this.scrollLeft (event);
        }
    }
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

    if (this.surface.isShiftPressed ())
    {
        var device = this.model.getCursorDevice ();
        switch (this.surface.getCurrentMode ())
        {
            case Maschine.MODE_BANK_DEVICE:
                if (device.hasNextParameterPage ())
                    device.nextParameterPage ();

                this.notifyBankChange ();
                break;
        }
    }
    else
    {
        if (Maschine.isDeviceMode (this.surface.getCurrentMode ()))
        {
            this.model.getCursorDevice ().selectNext ();
        }
        else
        {
            this.scrollRight (event);
        }
    }
};

//--------------------------------------
// Pads
//--------------------------------------

AbstractView.prototype.onPadMode = function (event) // keyboard
{
    this.refreshButton (MaschineButton.PAD_MODE, event);

    if (!event.isDown ())
        return;

    if (!this.surface.isActiveView (Maschine.VIEW_PLAY))
    {
        this.surface.setActiveView (Maschine.VIEW_PLAY);
    }
};

AbstractView.prototype.onScene = function (event)
{
    this.refreshButton (MaschineButton.SCENE, event);

    if (!event.isDown ())
        return;

    if (!this.surface.isActiveView (Maschine.VIEW_SESSION))
    {
        this.surface.setActiveView (Maschine.VIEW_SESSION);
    }
};

AbstractView.prototype.onPattern = function(event)
{
    this.refreshButton (MaschineButton.PATTERN, event);

    if (!event.isDown ())
        return;

    if (!this.surface.isActiveView (Maschine.VIEW_DRUM))
    {
        this.surface.setActiveView (Maschine.VIEW_DRUM);
    }
};

AbstractView.prototype.doNavigateAction = function (index)
{
    println("Maschine.doNavigateAction " + index);
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
};

AbstractView.prototype.onSelect = function (event)
{
    this.refreshButton (MaschineButton.SELECT, event);

    if (event.isLong ())
        return;

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

//    if (event.isDown ())
//    {
//        if (this.surface.isActiveMode (Maschine.MODE_BANK_DEVICE))
//        {
//            this.surface.setPendingMode (Maschine.MODE_PARAM_PAGE_SELECT);
//        }
//        else if (Maschine.isDeviceBankMode (this.surface.getActiveMode ().getId ()) ||
//                 this.surface.isActiveMode (Maschine.MODE_PARAM_PAGE_SELECT))
//        {
//            this.surface.setPendingMode (Maschine.MODE_BANK_DEVICE);
//        }
//    }
//    else
//    {
//        if (this.surface.isActiveMode (Maschine.MODE_PARAM_PAGE_SELECT))
//        {
//            //this.surface.setPendingMode (Maschine.MODE_BANK_DEVICE);
//        }
//    }
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

AbstractView.prototype.onJogWheelInternal = function (increase)
{
    if (this.surface.isShiftPressed ())
    {
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

                this.notifyBankChange ();
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
    this.surface.getDisplay ().showNotification ("Current Tempo:     " + bpm + " BPM");
};

AbstractView.prototype.updateArrowStates = function ()
{
    var tb = this.model.getCurrentTrackBank ();
    var isDevice = Maschine.isDeviceMode (this.surface.getCurrentMode ());

    var sel = tb.getSelectedTrack ();
    // var cd = this.model.getCursorDevice ();
    this.canScrollLeft = isDevice ? true /* TODO: Bitwig bug cd.canSelectPreviousFX () */ :
        sel != null && sel.index > 0 || tb.canScrollTracksUp ();
    this.canScrollRight = isDevice ? true /* TODO: Bitwig bug cd.canSelectNextFX () */ :
        sel != null && sel.index < this.getCurrentTrackBankLength() - 1 || tb.canScrollTracksDown ();
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
}