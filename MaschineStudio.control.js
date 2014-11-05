// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

loadAPI(1);

load ("Config.js");
load ("framework/ClassLoader.js");

load ("maschine/ClassLoader.js");
Maschine.INSTANCE = Maschine.STUDIO;

load ("mode/ClassLoader.js");
load ("view/ClassLoader.js");
load ("Controller.js");

host.defineController("Native Instruments", "Maschine Studio", "0.1", "342ED090-C483-11E3-9C1A-0800200C9A66");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Maschine Studio Controller"], ["Maschine Studio Controller"]);
host.addDeviceNameBasedDiscoveryPair(["Maschine Studio Virtual Input"], ["Maschine Studio Virtual Output"]);
host.addDeviceNameBasedDiscoveryPair(["Maschine Studio In"], ["Maschine Studio Out"]);

var controller = null;

function init ()
{
    controller = new Controller (Maschine.STUDIO);
    println ("Initialized.");
}

function exit ()
{
    controller.shutdown ();
}

function flush ()
{
    controller.flush ();
}
