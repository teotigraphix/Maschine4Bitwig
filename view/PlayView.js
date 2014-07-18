

function PlayView()
{
}

PlayView.prototype = new BaseView();

PlayView.prototype.updateNoteMapping = function()
{
};

PlayView.prototype.init = function ()
{
	BaseView.prototype.init.call(this);
};

PlayView.prototype.onActivate = function ()
{
	BaseView.prototype.onActivate.call(this);
};

PlayView.prototype.usesButton = function(buttonID)
{
//	switch (buttonID)
//	{
//		case PUSH_BUTTON_REPEAT:
//		case PUSH_BUTTON_NEW:
//		case PUSH_BUTTON_SELECT:
//		case PUSH_BUTTON_ADD_EFFECT:
//		case PUSH_BUTTON_ADD_TRACK:
//		case PUSH_BUTTON_ACCENT:
//		case PUSH_BUTTON_USER_MODE:
//		case PUSH_BUTTON_DUPLICATE:
//		case PUSH_BUTTON_CLIP:
//			return false;
//	}
	return true;
};

PlayView.prototype.drawGrid = function ()
{
	// TODO
};

PlayView.prototype.onGrid = function (note, velocity)
{
	// TODO
};

PlayView.prototype.onUp = function ()
{
//	if (this.push.isShiftPressed ())
//		application.arrowKeyLeft ();
//	else
//		application.arrowKeyUp ();
};

PlayView.prototype.onDown = function ()
{
//	if (this.push.isShiftPressed ())
//		application.arrowKeyRight ();
//	else
//		application.arrowKeyDown ();
};

PlayView.prototype.onAll = function () // left
{
	var sel = getSelectedTrack ();
	var index = sel == null ? 0 : sel.index - 1;
	if (index == -1)
	{
		if (!canScrollTrackUp)
			return;
		trackBank.scrollTracksPageUp ();
		host.scheduleTask (selectTrack, [7], 100);
		return;
	}
	selectTrack (index);
};

PlayView.prototype.onAuto = function () // right
{
	var sel = getSelectedTrack ();
	var index = sel == null ? 0 : sel.index + 1;
	if (index == 8)
	{
		if (!canScrollTrackDown)
			return;
		trackBank.scrollTracksPageDown ();
		host.scheduleTask (selectTrack, [0], 100);
	}
	selectTrack (index);
};

PlayView.prototype.onLeft = function ()
{
//	if (currentMode == MODE_DEVICE)
//		device.selectPrevious ();
//	else
//	{
		var sel = getSelectedTrack ();
		var index = sel == null ? 0 : sel.index - 1;
		if (index == -1)
		{
			if (!canScrollTrackUp)
				return;
			trackBank.scrollTracksPageUp ();
			host.scheduleTask (selectTrack, [7], 100);
			return;
		}
		selectTrack (index);
//	}
};

PlayView.prototype.onRight = function ()
{
//	if (currentMode == MODE_DEVICE)
//		device.selectNext ();
//	else
//	{
		var sel = getSelectedTrack ();
		var index = sel == null ? 0 : sel.index + 1;
		if (index == 8)
		{
			if (!canScrollTrackDown)
				return;
			trackBank.scrollTracksPageDown ();
			host.scheduleTask (selectTrack, [0], 100);
		}
		selectTrack (index);
//	}
};