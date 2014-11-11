/**
 * Created by Teoti on 11/4/2014.
 */

function EditToolsView (model)
{
    BaseMaschineView.call (this, model);
}

EditToolsView.prototype = new BaseMaschineView ();

EditToolsView.prototype.attachTo = function (surface)
{
    //println("EditToolsView.attachTo() " + surface);
    AbstractView.prototype.attachTo.call (this, surface);

};

EditToolsView.prototype.updateNoteMapping = function ()
{
    this.noteMap =  this.scales.getEmptyMatrix ();
    // Workaround
    scheduleTask (doObject (this, function () { this.surface.setKeyTranslationTable (this.noteMap); }), null, 100);
};

EditToolsView.prototype.onActivate = function ()
{
    AbstractView.prototype.onActivate.call (this);
    //println("EditToolsView.onActivate() ");
    this.surface.lightButton (MaschineButton.SCENE, false);
    this.surface.lightButton (MaschineButton.PATTERN, false);
    this.surface.lightButton (MaschineButton.PAD_MODE, false);
    this.surface.lightButton (MaschineButton.NAVIGATE, false);

    //this.surface.sendColor(MaschineButton.GROUP_D, COLOR.MUTE);

    //this.model.getTrackBank ().setIndication (false);
    //this.updateSceneButtons ();
    //this.initMaxVelocity ();
};