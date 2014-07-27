
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
    var scales = new Scales(36, 52, 4, 4);
    var model = new Model (21, scales);

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

        // Edit
        MaschineButton.UNDO,
        MaschineButton.REDO,

        // Navigate
        MaschineButton.JOG_WHEEL,
        MaschineButton.LEFT_ARROW,
        MaschineButton.RIGHT_ARROW,
        MaschineButton.ENTER
    ];
    var gridNotes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];

    // create Touch
    var config = new ControlSurfaceConfig (model, input, output, buttons, gridNotes);
    config.shiftButtonId = MaschineButton.SHIFT;
    config.selectButtonId = MaschineButton.SELECT;

    config.pads = new Grid (output);
    //config.display = new Display (output);

    this.attach (new MaschineStudio (), config);
};
