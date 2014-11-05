// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

loadAPI(1);

load ("Config.js");
load ("framework/ClassLoader.js");

load ("maschine/ClassLoader.js");
Maschine.INSTANCE = Maschine.MK1;

load ("mode/ClassLoader.js");
load ("view/ClassLoader.js");
load ("Controller.js");

host.defineController("Native Instruments", "Maschine MK1", "0.1", "FF7AD6B0-6535-11E4-9803-0800200C9A66");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Maschine MK1 Controller"], ["Maschine MK1 Controller"]);
host.addDeviceNameBasedDiscoveryPair(["Maschine MK1 Virtual Input"], ["Maschine MK1 Virtual Output"]);
host.addDeviceNameBasedDiscoveryPair(["Maschine MK1 In"], ["Maschine MK1 Out"]);

var controller = null;

function init ()
{
    controller = new Controller (Maschine.MK1);
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