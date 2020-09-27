'use strict';

let RadioRa2 = require('../lib/radiora2');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

// This is an example NodeServer Node definition.
// You need one per nodedefs.

// nodeDefId must match the nodedef id in your nodedef
const nodeDefId = 'MAESTRO_DIMMER';

module.exports = function(Polyglot) {
// Utility function provided to facilitate logging.
  const logger = Polyglot.logger;
  // var radiora2 = new RadioRa2();
  var radiora2 = new RadioRa2();

  // This is your custom Node class
  class MaestroDimmerNode extends Polyglot.Node {
    constructor(polyInterface, primary, address, name) {
      super(nodeDefId, polyInterface, primary, address, name);     

      this.hint = '0x01020900'; // Example for a Dimmer switch

      this.commands = {
        DON: this.onDON,
        DOF: this.onDOF,
        // You can use the query function from the base class directly
        QUERY: this.query,
      };

      this.drivers = {
        ST: {value: '0', uom: 51},
      };

      
    }

    onDON(message) {
      logger.info('DON (%s): %s',
        this.address,
        message.value ? message.value : 'No value');

      // setDrivers accepts string or number (message.value is a string)
      this.setDriver('ST', message.value ? message.value : '100');
      radiora2.emit('debug', "data from Maestro: DON");
    }

    onDOF() {
      logger.info('DOF (%s)', this.address);
      this.setDriver('ST', '0');
    }

  };

  radiora2.on('debug', function(data) {
    logger.info("data from the Maestro Node " + data);
  }.bind(this));

  // radiora2.on('debug', function(data) {
  //   logger.info("data from the Maestro Node " + data);
  // }.bind(this));

  // Required so that the interface can find this Node class using the nodeDefId
  MaestroDimmerNode.nodeDefId = nodeDefId;

  return MaestroDimmerNode;
};




// Those are the standard properties of every nodes:
// this.id              - Nodedef ID
// this.polyInterface   - Polyglot interface
// this.primary         - Primary address
// this.address         - Node address
// this.name            - Node name
// this.timeAdded       - Time added (Date() object)
// this.enabled         - Node is enabled?
// this.added           - Node is addeto ISY?
// this.commands        - List of allowed commands
//                        (You need to define them in your custom node)
// this.drivers         - List of drivers
//                        (You need to define them in your custom node)

// Those are the standard methods of every nodes:
// Get the driver object:
// this.getDriver(driver)

// Set a driver to a value (example set ST to 100)
// this.setDriver(driver, value, report=true, forceReport=false, uom=null)

// Send existing driver value to ISY
// this.reportDriver(driver, forceReport)

// Send existing driver values to ISY
// this.reportDrivers()

// When we get a query request for this node.
// Can be overridden to actually fetch values from an external API
// this.query()

// When we get a status request for this node.
// this.status()