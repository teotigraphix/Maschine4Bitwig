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

host.defineController(Maschine.VENDOR, Maschine.MK1_NAME, Maschine.VERSION, Maschine.MK1_UID, Maschine.AUTHOR);
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