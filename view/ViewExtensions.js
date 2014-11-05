// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

AbstractView.prototype.onEnter = function (event) {};
AbstractView.prototype.onSelect = function (event) {};

AbstractView.prototype.onBrowse = function (event) {};
AbstractView.prototype.onSampling = function (event) {};

// Arrow Left/Right page Knob pages

//--------------------------------------
// Center Display
//--------------------------------------

AbstractView.prototype.onAll = function () {};
AbstractView.prototype.onAuto = function () {};

AbstractView.prototype.onFirstRow = function (event, index) {};
AbstractView.prototype.onValueKnob = function (index, value) {};

AbstractView.prototype.onNoteRepeat = function () {};

//--------------------------------------
// Transport
//--------------------------------------

AbstractView.prototype.onRestart = function (event)
{
    this.refreshButton (MaschineButton.RESTART, event);

    if (this.surface.isShiftPressed ()) {
        this.model.getTransport ().stop ();
        this.model.getTransport ().setPosition (0);
    }
    else
        this.model.getTransport ().restart ();
}; // loop


AbstractView.prototype.showTempo = function ()
{
    var bpm = parseFloat (Math.round (this.model.getTransport ().getTempo () * 100) / 100).toFixed (2);
    this.surface.getDisplay ().showNotification ("Current Tempo:     " + bpm + " BPM");
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