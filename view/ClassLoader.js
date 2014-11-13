// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

load ("ViewExtensions.js");

if (Maschine.INSTANCE == Maschine.STUDIO)
    load ("ViewExtensionsStudio.js");
else if (Maschine.INSTANCE == Maschine.MK2)
    load ("ViewExtensionsMK2.js");
else if (Maschine.INSTANCE == Maschine.MIKROMK2)
    load ("ViewExtensionsMikroMK2.js");
else if (Maschine.INSTANCE == Maschine.MK1)
    load ("ViewExtensionsMK1.js");

load ("BaseMaschineView.js");
load ("AbstractSceneView.js");
load ("AbstractSequencerView.js");
load ("PlayView.js");
load ("SceneView.js");
load ("DrumView.js");
load ("StepSequencerView.js");
load ("EditToolsView.js");
load ("ModeView.js");
load ("NavigateActionView.js");
load ("MuteView.js");
load ("SoloView.js");
load ("TrackView.js");