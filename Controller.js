
function Controller()
{
}

Controller.prototype = new BaseController ();

Controller.prototype.init = function ()
{
    BaseController.prototype.init.call (this);

    var input = new MaschineMidiInput ();
    var output = new MidiOutput ();

    // create Model, pass user mode, this seems wrong
    var model = new Model (21);

    // array of cc numbers that are used in the
    var buttons = [
        MaschineButton.TOP_ROW_0,
        MaschineButton.TOP_ROW_1,
        MaschineButton.TOP_ROW_2,
        MaschineButton.TOP_ROW_3,
        MaschineButton.TOP_ROW_4,
        MaschineButton.TOP_ROW_5,
        MaschineButton.TOP_ROW_6,
        MaschineButton.TOP_ROW_7,

        MaschineButton.TAP,

        // Encoders
        MaschineButton.ENCODER_1,
        MaschineButton.ENCODER_2,
        MaschineButton.ENCODER_3,
        MaschineButton.ENCODER_4,
        MaschineButton.ENCODER_5,
        MaschineButton.ENCODER_6,
        MaschineButton.ENCODER_7,
        MaschineButton.ENCODER_8,

        // Groups
        MaschineButton.GROUP_A,
        MaschineButton.GROUP_B,
        MaschineButton.GROUP_C,
        MaschineButton.GROUP_D,
        MaschineButton.GROUP_E,
        MaschineButton.GROUP_F,
        MaschineButton.GROUP_G,
        MaschineButton.GROUP_H,

        // Transport
        MaschineButton.RESTART,
        MaschineButton.METRO,
        MaschineButton.PLAY,
        MaschineButton.REC,
        MaschineButton.ERASE,

        // Navigate
        MaschineButton.JOG_WHEEL,
        MaschineButton.ENTER
    ];
    var gridNotes = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

    // create Touch
    var config = new ControlSurfaceConfig (model, input, output, buttons, gridNotes);
    config.shiftButtonId = MaschineButton.SHIFT;
    config.selectButtonId = MaschineButton.SELECT;
    //config.display = new Display (this.output);

    this.attach (new MaschineStudio (), config);
};
