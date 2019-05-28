/**
 *	@author marcd
 * 	2019-03-01
 */

/*
 * 'preisach' is the top object of Preisach and defines the namespace
 *
 * 	script can be used inside a <script> tag, tested using node runtime, (or installed via npm...later)
 *
 */

/*
 * probably too many initialisation functions exposed
 * those otherwise internal variables are required for the exhaustive drawing of combinations
 */

// 	TODO
	// 
	// improve, upgrade to ES6 etc
	// increase functionality
	// separate utilities that exist solely for drawing purposes into module/submodule
	// and while at it probably use a build script and typescript
	// publish to npm
	// write decent discrete update algorithm.
	// write good test for benchmarking discrete.update
	// invite update algorithm submissions
// 	Contributors welcome :)

(function(exports) {

	/**
	 * 	@params t1, t2, x0, y0
	 * 		lower threshold, higher threshold, intiial input, initial output
	 * 	@returns
	 * 		meh, this should probably look like a class
	 */
	function thermostat(t1, t2, x0, y0)  {
		this.low = t1;
		this.high = t2;
		this.input = x0;
		this.output = y0;
		/**
		 *
		 */
		this.update = function(x) { 
			if(x <= this.low) {
				this.output = 0;
			} else if (x >= this.high) {
				this.output = 1;
			} 
			return this.output;
		}
		this.output = this.update(x0);
	}

	/**
	 * @params s1, s2, n, 
	 * 		support min, support max, number of thresholds inside support
	 * @return thresholds, 
	 * 		list of thresholds
	 */
	function initThresholds(s1, s2, n) { 
		let thresholds = [Number.NEGATIVE_INFINITY];
		let p = (s2 - s1)/(n+2.0);		
		for (let i = 1; i <= n+1; i++) {
			thresholds.push(s1 + (i)*p);
		}
		thresholds.push(Infinity);
		return thresholds;
	}

	/**
	 *
	 */
	function initStates(thresholds, str, state) {
		if (str === 'saturated') {
			// this.saturated = function() {
			// console.log("str = ", str);
			let size = thresholds.length - 3;
			let k = 0;
			let arr = [];
			for (let j = 1; j <= size; j++) {
				for(let i = j+1; i <= size+1; i++) {
					arr[k] = state;
					k++;
				}
			}
			return arr;
			// }
		}		
		// this.deGaussed = function(thresholds) {			
		// 	// TODO
		// 	// need this for best images for wikipedia
		// 	return 0;//arr;
		// }
	}

	/**
	 *
	 */
	function initWeights(thresholds, str) {		
		/**
		 * uniformWeights
		 * 	@params
		 *		thresholds, a list of hysteron thresholds	 		
		 * 	@return 
		 *  	weights, a 1-D array of weights
		 */
		// BOGUS 
		// should probably use 2-D arrays or hash maps or something
		if (str === 'uniform') {
			// this.uniformWeights = function() {
			// BOGUS		
			// bascally a place holder for a decent probability distribution manager		
			let l = thresholds.length - 3	;
			let size = l * (l+1) / 2;

			let weights = [];
			let weight = 1.0/size;
			for (let i = 0; i < size; i++) {
				weights[i] = weight;
			}
			return weights;
			// }
		}
	}

	/**
	 *
	 */
	function initThermostats (thresholds, x0, states) {
		// BOGUS 
		// should probably use 2-D arrays or hash maps or something
		let size = thresholds.length - 3;
		let k = 0;
		let thermostats = [];
		for (let j = 1; j <= size; j++) {
			for(let i = j+1; i <= size+1; i++) {
				thermostats[k] = new thermostat(thresholds[j], thresholds[i], x0, states[k]);
				k++;
			}
		}
		return thermostats;
	}

	/**
	 *
	 */
	function discrete(thresholds, thermostats, weights, x0, y0) { 
		this.thresholds = thresholds;
		this.thermostats = thermostats;
		// BOGUS uniformWeights EVERYWHERE
		this.weights = weights;
		this.weight = weights[0];
		this.input = x0;

		// BOGUS
		// should have a check on validity of initial output	
		this.output = y0;

		// BOGUS
		// TOTAL NONSENSE WHY DO WE HAVE THIS currentThreshold PAIN IN THE ASS
		// MUST ALSO BE CAREFUL HOW IT IS ITITIALISED
		this.currentThreshold =  2; // thresholds.length - 2; 	


		/**
		 *
		 */
		this.update = function(x) {
			// BOGUS
			// it works because both input and output are stacks 
			// and we update all of the IO pairs at the same time ... but...
			// it is basically wrong to push on to a stack in both cases.			
			let inputs = this.regulateInput(x);	
			let outputs = []
			// for (let i of inputs) {
			for (let i = 0; i < inputs.length - 1; i++) {
				outputs.push(this.updateThermostats(inputs[i]));
			}
			// can't remember why I am doing this...
			// maybe for the nonlinear bit
			// console.log('thermostats = ', this.thermostats);
			let s = 0;
			let s0 = this.thermostats[0].update(inputs[inputs.length - 1])*this.weight;
			for (let i = 0; i < this.thermostats.length; i++) {
				// console.log("updating thermostats");
				let ss = this.thermostats[i].update(inputs[inputs.length - 1])*this.weight;
				// console.log('this val = ', ss);
				if (ss - s0 > 0.00000001) {
					// console.log('i = ', i);
					// console.log('s0 = ', s0);
					// console.log('this val = ', ss);
					// console.log('thermostat = ', this.thermostats[i]);
					// console.log('out = ', this.thermostats[i].output);
				}
				s += ss;
			}
			outputs.push(s);

			// console.log("currentthreshold = ", this.currentThreshold);
			// console.log("inputs = ", inputs);
			// console.log("outputs = ", outputs);

			return [inputs, outputs];
		}

		/**
		 * @params x, input
		 * @return steps, list, new input preceeded by input thresholds crossed from xOld to x
		 */
		this.regulateInput = function(x) {
			if (this.thresholds[this.currentThreshold - 1] < x && 
				x < this.thresholds[this.currentThreshold + 1]) {
				// console.log("THIS IS AN UPDATE WITH NO JUMPS")
				return [x];
			} 
			var inputSteps = [];
			inputSteps.push(this.thresholds[this.currentThreshold]);
			while (x < this.thresholds[this.currentThreshold - 1]) { //} && this.currentThreshold >= 0) {
				inputSteps.push(this.thresholds[--this.currentThreshold]);
			}
			while (x > this.thresholds[this.currentThreshold + 1]){ //} && this.currentThreshold <= this.thresholds.length) {
				inputSteps.push(this.thresholds[++this.currentThreshold]);
			}
			inputSteps.push(x);
			return inputSteps;
		}

		/**
		 * TODO
		 * there are some clever ways to minimize the number of thermostats to be updated
		 * write a benchmark, cite fpga implementation,
		 * invite submissions
		 */
		this.updateThermostats = function (threshold) { 
			let sum = 0;
			for (let i = 0; i < this.thermostats.length; i++) {				
				let o = this.thermostats[i].update(threshold);
				sum += this.weight * o;
				// console.log('Thermostat Num... = ', i);
				// console.log('weight = ', this.weight);
			}
			// console.log('Sum Thermostats... = ', sum);
			return sum;
		}
	}

	// module.exports.preisach = preisach;
	exports.thermostat = thermostat;
	exports.initThresholds = initThresholds;
	exports.initStates = initStates;
	exports.initWeights = initWeights;
	exports.initThermostats = initThermostats;
	// exports.initWeights().uniformWeights = initWeights.uniformWeights;
	// exports.utils = utils;
	exports.discrete = discrete;
})( typeof exports === 'undefined' ? this['preisach'] = {}: exports );
