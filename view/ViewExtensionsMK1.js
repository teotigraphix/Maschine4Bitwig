// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

AbstractView.prototype.onNoteRepeat = function (event)
{
    this.refreshButton (MaschineButton.NOTE_REPEAT, event);

    if (!event.isDown ())
        return;

    if (this.surface.isShiftPressed ())
        this.model.getTransport ().tapTempo ();
};

AbstractView.prototype.onPlay = function (event)
{
    this.refreshButton (MaschineButton.PLAY, event);

    if (!event.isDown ())
        return;

    if (this.surface.isShiftPressed ())
        this.model.getTransport ().toggleClick ();
    else if (this.surface.isSelectPressed ())
        this.model.getTransport ().toggleMetronomeTicks ();
    else
    {
        if (this.model.getTransport().isPlaying)
            this.model.getTransport().stop ();
        else
            this.model.getTransport().play ();
    }
};

AbstractView.prototype.onJogWheel = function (increase)
{
    this.onJogWheelInternal (increase);

    if (this.surface.isPressed (MaschineMK2Button.TEMPO))
        this.model.getTransport ().changeTempo (increase, this.surface.isShiftPressed ());
    else if (this.surface.isSelectPressed () && this.surface.isPressed (MaschineButton.PLAY))
        this.model.getTransport ().changeMetronomeVolume (increase, Config.fractionValue);
};

AbstractView.prototype.onJogWheel2 = function (increase)
{
   this.model.getTransport ().changeTempo (increase, this.surface.isShiftPressed ());
};

AbstractView.prototype.onJogWheel3 = function (increase)
{
};