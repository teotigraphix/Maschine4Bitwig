
function TestMode (model)
{
    BaseMode.call (this, model);
    this.id = MODE_TEST;
}

TestMode.prototype = new BaseMode ();

TestMode.prototype.onTopRow = function (event, index) {
    if (!event.isDown())
        return;

    println("TestMode.onTopRow()" + index);

    switch (index)
    {
        case 0:
            this.model.getCursorDevice ().selectPrevious ();
            break;

        case 1:
            this.model.getCursorDevice ().selectNext ();
            break;

        case 2:
            break;

        case 3:
            break;

        case 4:
            break;

        case 5:
            break;

        case 6:
            this.surface.getActiveView ().scales.decOctave ();
            this.surface.getActiveView ().updateNoteMapping ();
            //println(this.surface.getActiveView ().scales.getOctave());
            host.showPopupNotification("Current octave: " + this.surface.getActiveView ().scales.getOctave());
            break;

        case 7:
            this.surface.getActiveView ().scales.incOctave ();
            this.surface.getActiveView ().updateNoteMapping ();
            //println(this.surface.getActiveView ().scales.getOctave());
            host.showPopupNotification("Current octave: " + this.surface.getActiveView ().scales.getOctave());
            break;
    }
};
