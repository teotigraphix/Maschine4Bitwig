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

load ("AbstractSequencerView.js");
load ("BaseMaschineView.js");
load ("PlayViewMS.js");
load ("SessionViewMS.js");
load ("DrumViewMS.js");
load ("EditToolsView.js");