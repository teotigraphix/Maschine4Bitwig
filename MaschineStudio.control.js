// Written by Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

loadAPI(1);

host.defineController("Native Instruments", "Maschine Studio", "0.1", "342ED090-C483-11E3-9C1A-0800200C9A66");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Maschine Studio Controller"], ["Maschine Studio Controller"]);
host.addDeviceNameBasedDiscoveryPair(["Maschine Studio Virtual Input"], ["Maschine Studio Virtual Output"]);
host.addDeviceNameBasedDiscoveryPair(["Maschine Studio In"], ["Maschine Studio Out"]);

function init ()
{
    println ("Initialized.");
}

function exit ()
{
}

function flush ()
{
}
