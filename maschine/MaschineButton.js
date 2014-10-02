// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function MaschineButton()
{
}

MaschineButton.STATE_UP = 0;
MaschineButton.STATE_DOWN = 127;

MaschineButton.CHANNEL = 5;
MaschineButton.PLUGIN = 6;
MaschineButton.ARRANGE = 7;
MaschineButton.MIX = 8;
MaschineButton.BROWSE = 9;
MaschineButton.SAMPLING = 10;
MaschineButton.ALL = 11;
MaschineButton.AUTO = 12;

MaschineButton.TOP_ROW_0 = 13;
MaschineButton.TOP_ROW_1 = 14;
MaschineButton.TOP_ROW_2 = 15;
MaschineButton.TOP_ROW_3 = 16;
MaschineButton.TOP_ROW_4 = 17;
MaschineButton.TOP_ROW_5 = 18;
MaschineButton.TOP_ROW_6 = 19;
MaschineButton.TOP_ROW_7 = 20;

// Knobs 21-28
MaschineButton.ENCODER_1 = 21;
MaschineButton.ENCODER_2 = 22;
MaschineButton.ENCODER_3 = 23;
MaschineButton.ENCODER_4 = 24;
MaschineButton.ENCODER_5 = 25;
MaschineButton.ENCODER_6 = 26;
MaschineButton.ENCODER_7 = 27;
MaschineButton.ENCODER_8 = 28;

MaschineButton.IN1 = 30;
MaschineButton.IN2 = 31;
MaschineButton.IN3 = 32;
MaschineButton.IN4 = 33;

MaschineButton.MST = 34;
MaschineButton.GRP = 35;
MaschineButton.SND = 36;
MaschineButton.CUE = 37;

MaschineButton.ENCODER_LARGE = 38; // 0(to left), 1(to right)

MaschineButton.TAP = 40;
MaschineButton.STEP_MODE = 41;
MaschineButton.MACRO = 42;
MaschineButton.NOTE_REPEAT = 43;

MaschineButton.GROUP_A = 44;
MaschineButton.GROUP_B = 45;
MaschineButton.GROUP_C = 46;
MaschineButton.GROUP_D = 47;
MaschineButton.GROUP_E = 48;
MaschineButton.GROUP_F = 49;
MaschineButton.GROUP_G = 50;
MaschineButton.GROUP_H = 51;

MaschineButton.RESTART = 52;
MaschineButton.METRO = 53;
MaschineButton.EVENTS = 54;
MaschineButton.GRID = 55;
MaschineButton.PLAY = 56;
MaschineButton.REC = 57;
MaschineButton.ERASE = 58;

// Shift is disabled, Enter is used for Shift
//MaschineButton.SHIFT = -1;
MaschineButton.SCENE = 60;
MaschineButton.PATTERN = 61;
MaschineButton.PAD_MODE = 62;
MaschineButton.NAVIGATE = 63;
MaschineButton.DUPLICATE = 64;
MaschineButton.SELECT = 65;
MaschineButton.SOLO = 66;
MaschineButton.MUTE = 67;

MaschineButton.COPY = 70;
MaschineButton.PASTE = 71;
MaschineButton.NOTE = 72;
MaschineButton.NUDGE = 73;
MaschineButton.UNDO = 74;
MaschineButton.REDO = 75;
MaschineButton.QUANTIZE = 76;
MaschineButton.CLEAR = 77;

MaschineButton.BACK = 85;
MaschineButton.LEFT_ARROW = 86;
MaschineButton.RIGHT_ARROW = 87;
MaschineButton.ENTER = 88; // Used as Shift

MaschineButton.JOG_WHEEL = 80;

// Proxy
MaschineButton.ARROW_LEFT = MaschineButton.GROUP_F;
MaschineButton.ARROW_UP = MaschineButton.GROUP_C;
MaschineButton.ARROW_DOWN = MaschineButton.GROUP_G;
MaschineButton.ARROW_RIGHT = MaschineButton.GROUP_H;

MaschineButton.SHIFT = MaschineButton.ENTER;