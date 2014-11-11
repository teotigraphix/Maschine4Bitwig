// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function AbstractSequencerView (model, rows, cols)
{
    if (!model) // Called on first prototype creation
        return;

    BaseMaschineView.call (this, model);

    this.resolutions = [ 1, 2/3, 1/2, 1/3, 1/4, 1/6, 1/8, 1/12 ];
    this.selectedIndex = 4;
    this.scales = this.model.getScales ();

    this.offsetX = 0;
    this.offsetY = 0;

    this.clip = this.model.createCursorClip (cols, rows);
    this.clip.setStepLength (this.resolutions[this.selectedIndex]);
}
AbstractSequencerView.prototype = new BaseMaschineView ();

AbstractSequencerView.prototype.onActivate = function ()
{
    AbstractView.prototype.onActivate.call (this);

    this.model.getCurrentTrackBank ().setIndication (false);
    //this.drawSceneButtons ();
};

//AbstractSequencerView.prototype.scrollLeft = function (event)
//{
//    var newOffset = this.offsetX - this.clip.getStepSize ();
//    if (newOffset < 0)
//        this.offsetX = 0;
//    else
//    {
//        this.offsetX = newOffset;
//        this.clip.scrollStepsPageBackwards ();
//    }
//};
//
//AbstractSequencerView.prototype.scrollRight = function (event)
//{
//    this.offsetX = this.offsetX + this.clip.getStepSize ();
//    this.clip.scrollStepsPageForward ();
//};

//AbstractSequencerView.prototype.onScene = function (index)
//{
//    this.selectedIndex = 7 - index;
//    this.clip.setStepLength (this.resolutions[this.selectedIndex]);
//    this.drawSceneButtons ();
//};

AbstractSequencerView.prototype.isInXRange = function (x)
{
    return x >= this.offsetX && x < this.offsetX + this.clip.getStepSize ();
};
