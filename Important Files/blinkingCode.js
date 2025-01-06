function initializeLedGroup(className, updateInterval) {
    var ledGrpElems = document.getElementsByClassName(className);
    var ledGrps = [];
    
    for (var i = 0; i < ledGrpElems.length; i++) {
        let consts = Array.from(ledGrpElems[i].children).map(child => ({
            'ontime': parseInt(child.getAttribute('ontime')) || 1000,
            'offtime': parseInt(child.getAttribute('offtime')) || 1000,
            'oncolor': child.getAttribute('oncolor') || 'green',
            'offcolor': child.getAttribute('offcolor') || 'red'
        }));
        let vars = consts.map(() => ({ 'time': 0, 'state': false }));

        ledGrps[i] = { consts, vars };
        
        ledGrpElems[i].setAttribute('blink', 'true');
        ledGrpElems[i].onclick = function () {
            var turningOn = !(this.getAttribute('blink') === 'true');
            this.setAttribute('blink', turningOn);
            for (var c of this.children) {
                c.style.background = turningOn ? c.getAttribute('oncolor') : 'darkgray';
            }
        };
    }

    setInterval(function () {
        for (var i = 0; i < ledGrpElems.length; i++) {
            if (ledGrpElems[i].getAttribute('blink') === 'true') {
                for (var j = 0; j < ledGrpElems[i].children.length; j++) {
                    var time = ledGrps[i].vars[j].time;
                    ledGrps[i].vars[j].time = time + updateInterval;

                    if (ledGrps[i].vars[j].state) {
                        if (time > ledGrps[i].consts[j].offtime) {
                            ledGrpElems[i].children[j].style.background = ledGrps[i].consts[j].oncolor;
                            ledGrps[i].vars[j].state = false;
                            ledGrps[i].vars[j].time = 0;
                        }
                    } else {
                        if (time > ledGrps[i].consts[j].ontime) {
                            ledGrpElems[i].children[j].style.background = ledGrps[i].consts[j].offcolor;
                            ledGrps[i].vars[j].state = true;
                            ledGrps[i].vars[j].time = 0;
                        }
                    }
                }
            }
        }
    }, updateInterval);
}

// Initialize different LED groups with their respective update intervals
initializeLedGroup('ledGroup', 100);   // Update every 100ms
initializeLedGroup('ledGroup2', 10);  // Update every 10ms
