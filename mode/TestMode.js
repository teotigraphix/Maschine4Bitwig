
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

};
