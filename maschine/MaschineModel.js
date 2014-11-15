// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function MaschineModel ()
{
    this.sceneBank = new SceneBankProxy (16);
}

MaschineModel.prototype.getSceneBank = function ()
{
    return this.sceneBank;
};

