// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function SceneTriggerView (model)
{
    AbstractView.call (this, model);

    this.sceneBank = new SceneBankProxy (16);
}
SceneTriggerView.prototype = new AbstractView ();

SceneTriggerView.prototype.drawGrid = function ()
{
    for (var i = 36; i < 52; i++)
    {
        //this.surface.pads.light (i, this.sceneBank.sceneExists (i - 36) ? COLOR.ON : COLOR.OFF);
        var name = this.sceneBank.getSceneName (i - 36);
        this.surface.pads.light (i,  this.pressedKey == i ? COLOR.ON : name == "" ? COLOR.OFF : COLOR.ON_MEDIUM);
    }
};
SceneTriggerView.prototype.onGridNote = function (note, velocity)
{
    this.pressedKey = -1;
    if (velocity > 0)
    {
        var index = note - 36;
        this.pressedKey = note;
        this.sceneBank.launchScene (index);
        this.sceneBank.selectScene (index);
        this.sceneBank.showScene (index);
    }
    else
    {

    }
};
