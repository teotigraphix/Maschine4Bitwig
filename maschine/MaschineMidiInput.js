// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function MaschineMidiInput ()
{
    MidiInput.call (this);
}

MaschineMidiInput.prototype = new MidiInput();

MaschineMidiInput.prototype.createNoteInput = function ()
{
    var noteInput = this.port.createNoteInput ("Maschine Pads", "80????", "90????");
    noteInput.setShouldConsumeEvents (false);
    return noteInput;
};