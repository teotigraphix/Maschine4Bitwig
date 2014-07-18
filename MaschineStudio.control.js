// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under GPLv3 - http://www.gnu.org/licenses/gpl.html

loadAPI(1);

load("Config.js");
load ("bitwig-framework/ClassLoader.js");
load ("mode/ClassLoader.js");
load ("view/ClassLoader.js");
load ("core/ClassLoader.js");
load ("Controller.js");

host.defineController("Native Instruments", "Maschine Studio", "0.1", "342ED090-C483-11E3-9C1A-0800200C9A66");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Maschine Studio Controller"], ["Maschine Studio Controller"]);
host.addDeviceNameBasedDiscoveryPair(["Maschine Studio Virtual Input"], ["Maschine Studio Virtual Output"]);
host.addDeviceNameBasedDiscoveryPair(["Maschine Studio In"], ["Maschine Studio Out"]);

var controller = null;

function init ()
{
    controller = new Controller ();
    controller.init ();
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