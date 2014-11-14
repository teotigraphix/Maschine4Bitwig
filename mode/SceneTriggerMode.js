// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function SceneTriggerMode (model)
{
    BaseMode.call (this, model);
    this.id = Maschine.MODE_SCENE_TRIGGER;
}

SceneTriggerMode.prototype = new BaseMode ();

SceneTriggerMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay();
    d.clear ();
    var sb = this.surface.getView (Maschine.VIEW_SCENE_TRIGGER).sceneBank;

    for (var i = 0; i < 4; i++)
        d.setCell (0, i, sb.getSceneName (i));

    for (var i = 0; i < 4; i++)
        d.setCell (1, i, sb.getSceneName (i + 4));

    for (var i = 0; i < 4; i++)
        d.setCell (0, i + 4, sb.getSceneName (i + 8));

    for (var i = 0; i < 4; i++)
        d.setCell (1, i + 4, sb.getSceneName (i + 12));

    d.allDone ();
};