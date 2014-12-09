// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function MaschineButton () {}

MaschineButton.STATE_UP = 0;
MaschineButton.STATE_DOWN = 127;

MaschineButton.CHANNEL = 0;
MaschineButton.PLUGIN = 1;
MaschineButton.ARRANGE = 2;
MaschineButton.MIX = 3;
MaschineButton.BROWSE = 4;
MaschineButton.SAMPLING = 5;
MaschineButton.ALL = 6;
MaschineButton.AUTO = 7;

MaschineButton.TOP_ROW_0 = 8;
MaschineButton.TOP_ROW_1 = 9;
MaschineButton.TOP_ROW_2 = 10;
MaschineButton.TOP_ROW_3 = 11;
MaschineButton.TOP_ROW_4 = 12;
MaschineButton.TOP_ROW_5 = 13;
MaschineButton.TOP_ROW_6 = 14;
MaschineButton.TOP_ROW_7 = 15;

// Knobs 21-28
MaschineButton.ENCODER_1 = 16; // 16
MaschineButton.ENCODER_2 = 17;
MaschineButton.ENCODER_3 = 18;
MaschineButton.ENCODER_4 = 19;
MaschineButton.ENCODER_5 = 20;
MaschineButton.ENCODER_6 = 21;
MaschineButton.ENCODER_7 = 22;
MaschineButton.ENCODER_8 = 23; // 23

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
MaschineButton.JOG_WHEEL_PUSH = 81;

// Proxy
MaschineButton.ARROW_LEFT = MaschineButton.GROUP_F;
MaschineButton.ARROW_UP = MaschineButton.GROUP_C;
MaschineButton.ARROW_DOWN = MaschineButton.GROUP_G;
MaschineButton.ARROW_RIGHT = MaschineButton.GROUP_H;

MaschineButton.SHIFT = MaschineButton.ENTER;

function MaschineStudioButton () {}
MaschineStudioButton.ENCODER_1_TOUCH = 100;
MaschineStudioButton.ENCODER_2_TOUCH = 101;
MaschineStudioButton.ENCODER_3_TOUCH = 102;
MaschineStudioButton.ENCODER_4_TOUCH = 103;
MaschineStudioButton.ENCODER_5_TOUCH = 104;
MaschineStudioButton.ENCODER_6_TOUCH = 105;
MaschineStudioButton.ENCODER_7_TOUCH = 106;
MaschineStudioButton.ENCODER_8_TOUCH = 107;

function MaschineMK1Button () {}
MaschineMK1Button.JOG2 = 100;
MaschineMK1Button.JOG3 = 101;

function MaschineMK2Button () {}

MaschineMK2Button.CONTROL = MaschineButton.CHANNEL;
MaschineMK2Button.STEP = MaschineButton.PLUGIN;

MaschineMK2Button.VOLUME = 70;
MaschineMK2Button.SWING = 71;
MaschineMK2Button.TEMPO = 72;
MaschineMK2Button.ARROW_JOG_LEFT = 73;
MaschineMK2Button.ARROW_JOG_RIGHT = 74;

function MaschineMikroMK2Button () {}

MaschineMikroMK2Button.CONTROL = MaschineButton.CHANNEL;
MaschineMikroMK2Button.F1 = 8;
MaschineMikroMK2Button.F2 = 9;
MaschineMikroMK2Button.F3 = 10;
MaschineMikroMK2Button.MAIN = MaschineButton.ENTER;
MaschineMikroMK2Button.GROUP = 1;