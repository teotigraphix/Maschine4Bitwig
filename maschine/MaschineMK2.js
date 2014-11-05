// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// array of cc numbers that are used in the
var MASCHINE_MK2_BUTTONS = [
];

function MaschineMK2 (output, input)
{
    Maschine.call (this, output, input, MASCHINE_MK2_BUTTONS);

    this.shiftButtonId = MaschineButton.SHIFT;
    this.selectButtonId = MaschineButton.SELECT;

    this.pads = new Grid (output);
    this.display = new Display(output);
    this.display.clear ().allDone ();
}

MaschineMK2.prototype = new Maschine ();