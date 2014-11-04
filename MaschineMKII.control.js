// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

loadAPI(1);

load ("Config.js");
load ("framework/ClassLoader.js");
load ("maschine/ClassLoader.js");
load ("mode/ClassLoader.js");
load ("view/ClassLoader.js");
load ("Controller.js");

host.defineController("Native Instruments", "Maschine MK2", "0.1", "EAE08E70-6076-11E4-9803-0800200C9A66");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Maschine MK2 Controller"], ["Maschine MK2 Controller"]);
host.addDeviceNameBasedDiscoveryPair(["Maschine MK2 Virtual Input"], ["Maschine MK2 Virtual Output"]);
host.addDeviceNameBasedDiscoveryPair(["Maschine MK2 In"], ["Maschine MK2 Out"]);

var controller = null;

function init ()
{
    controller = new Controller ();
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