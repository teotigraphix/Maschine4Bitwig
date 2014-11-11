// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function BaseMaschineView (model)
{
    AbstractView.call (this, model);

    this.tapCount = 0;
    this.lastTap = 0;
}

BaseMaschineView.prototype = new AbstractView ();

BaseMaschineView.prototype.updateButtons = function ()
{
   AbstractView.prototype.updateButtons.call (this);

    var t = this.model.getTransport ();

    this.surface.lightButton (MaschineButton.METRO, t.isClickOn);
    this.surface.lightButton (MaschineButton.PLAY, t.isPlaying);
    this.surface.lightButton (MaschineButton.REC, t.isRecording);

    var master = this.model.getMasterTrack ();
    var v = master.getVolume ();
    this.surface.setButton (MaschineButton.ENCODER_LARGE, v);
};
