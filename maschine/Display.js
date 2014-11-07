// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// Push character codes for value bars
Display.BARS_NON    = String.fromCharCode (6);
Display.BARS_ONE    = String.fromCharCode (3);
Display.BARS_TWO    = String.fromCharCode (5);
Display.BARS_ONE_L  = String.fromCharCode (4);
Display.NON_4       = Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON;
Display.RIGHT_ARROW = String.fromCharCode (127);

Display.SPACES =
    [
        '',
        ' ',
        '  ',
        '   ',
        '    ',
        '     ',
        '      ',
        '       ',
        '        ',
        '         ',
        '          ',
        '           ',
        '            ',
        '             '
    ];

Display.DASHES =
    [
        '',
        Display.BARS_NON,
            Display.BARS_NON + Display.BARS_NON,
            Display.BARS_NON + Display.BARS_NON + Display.BARS_NON,
            Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON,
            Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON,
            Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON,
            Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON,
            Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON,
            Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON + Display.BARS_NON
    ];

Display.SYSEX_MESSAGE =
    [
        "F0 00 00 66 17 12 ",
        "F0 00 00 66 17 12 "
    ];

Display.SYSEX_HEADER = "F0 00 00 66 17";

// 4 rows (0-3) with 4 blocks (0-3). Each block consists of 
// 17 characters or 2 cells (0-7).
function Display (output)
{
    AbstractDisplay.call (this, output, 2 /* No of rows */, 4 /* No of blocks */, 8 /* No of cells */, 55 /* No of characters */);
}
Display.prototype = new AbstractDisplay ();
Display.FORMAT_RAW = AbstractDisplay.FORMAT_RAW;
Display.FORMAT_VALUE = AbstractDisplay.FORMAT_VALUE;
Display.FORMAT_PAN = AbstractDisplay.FORMAT_PAN;

Display.NUM_CELLS = 8;
Display.CELL_SIZE = 6;

Display.prototype.setBlock = function (row, block, value)
{
    var cell = 2 * block;
    if (value.length > 7)
    {
        this.cells[row * 8 + cell]     = value.substr (0, 7);
        this.cells[row * 8 + cell + 1] = this.pad (value.substring (7), 7, ' ');
    }
    else
    {
        this.cells[row * 8 + cell] = this.pad (value, 7, ' ');
        this.clearCell (row, cell + 1);
    }
    return this;
};

Display.prototype.setCell = function (row, cell, value, format)
{
    value = this.pad (this.formatStr (value, format), Display.CELL_SIZE, ' ') + ' ';
    this.cells[row * Display.NUM_CELLS + cell] = value;
    return this;
};

Display.prototype.clear = function ()
{
    for (var i = 0; i < 2; i ++)
    {
        for (var j = 0; j < 8; j ++)
            this.setCell(i, j, '      ');
    }
    return this;
}

Display.prototype.clearCell = function (row, cell)
{
    this.cells[row * 8 + cell] = cell % 2 == 0 ? '       ' : '       ';
    return this;
};

Display.prototype.writeLine = function (row, text)
{
    var array = [];
    for (var i = 0; i < text.length; i++)
        array[i] = text.charCodeAt(i);
    this.output.sendSysex (Display.SYSEX_HEADER  + " 12 " + uint7ToHex(row * 56) +  toHexStr (array) + " F7");
};

Display.prototype.formatValue = function (value)
{
    var noOfBars = Math.round (16 * value / Config.maxParameterValue);
    var n = '';
    for (var j = 0; j < Math.floor (noOfBars / 2); j++)
        n += Display.BARS_TWO;
    if (noOfBars % 2 == 1)
        n += Display.BARS_ONE;
    return this.pad (n, Display.CELL_SIZE, Display.BARS_NON);
};

Display.prototype.formatPan = function (pan)
{
    var middle = Config.maxParameterValue / 2;
    if (pan == middle)
        return Display.NON_4 + Display.NON_4;
    var isLeft = pan < middle;
    var pos = isLeft ? middle - pan : pan - middle;
    var noOfBars = Math.round (16 * pos / Config.maxParameterValue);
    var n = '';
    for (var i = 0; i < Math.floor (noOfBars / 2); i++)
        n += Display.BARS_TWO;
    if (noOfBars % 2 == 1)
        n += isLeft ? Display.BARS_ONE_L : Display.BARS_ONE;
    n = Display.NON_4 + this.pad (n, 4, Display.BARS_NON);
    return isLeft ? this.reverseStr (n) : n;
};

Display.prototype.pad = function (str, length, character)
{
    if (typeof (str) == 'undefined' || str == null)
        str = '';
    var diff = length - str.length;
    if (diff < 0)
        return str.substr (0, length);
    if (diff > 0)
        return str + Display.SPACES[diff];//(character == ' ' ? Display.SPACES[diff] : Display.DASHES[diff]);
    return str;
};

Display.prototype.padLeft = function (str, length, character)
{
    if (typeof (str) == 'undefined' || str == null)
        str = '';
    var diff = length - str.length;
    if (diff < 0)
        return str.substr (0, length);
    if (diff > 0)
        return (character == ' ' ? Display.SPACES[diff] : Display.DASHES[diff]) + str;
    return str;
};

Display.prototype.formatStr = function (value, format)
{
    switch (format)
    {
        case Display.FORMAT_VALUE:
            return this.formatValue (value);
        case Display.FORMAT_PAN:
            return "NotSup";//this.formatPan (value);
        default:
            return value ? value.toString () : "";
    }
};
