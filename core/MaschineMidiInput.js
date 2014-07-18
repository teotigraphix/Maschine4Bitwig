
function MaschineMidiInput()
{
    MidiInput.call(this);
    println ("MaschineMidiInput()");
}

MaschineMidiInput.prototype = new MidiInput();

MaschineMidiInput.prototype.createNoteInput = function()
{
    var noteInput = this.port.createNoteInput("Maschine Pads", "80????", "90????", "E0????");
    noteInput.setShouldConsumeEvents(false);
    return noteInput;
};