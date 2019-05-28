/**
 * preisach_utils.js
 * @author marcd 2019-05-23
 * 
 */

/*
 * functions required for expressing all possible IO pairs
 */

// var preisach = require(['./preisach.js'], );
(function(exports) {
	/**
	 *
	 */
	var count; // combination counter

	/**
	 * recurser:
	 *
	 * @params 
	 * 		size, corners, arr, arrt, sideLength
	 * @return [arr, arrt], 
	 * 		a list of 2-D arrays of states and an array of thresholds
	 */
	function recurser(size, corners, arr, arrt, sideLength) {
		// required to create every internal state/combination
		// maybe easiest to explain if I upload the animated gif and python script
		if(size > 1) {
			// console.log("count = ", count);
			recurser(size-1, corners, arr, arrt, sideLength);
			let tmpCorners = corners.slice(); 	// use .slice() to create a element-wise copy
			tmpCorners.push(size);				// not sure why I really need a copy
			recurser(size-1, tmpCorners, arr, arrt, sideLength);
		} else {
			let i;
			let j;
			let c;
			for (i = 0; i < corners.length; i++) { // row
				c = corners[i];
				for (j = 0; j < c; j++) {			// col
					arr[count][sideLength-1 - i][i+j] = 1;
				}
			}
			// arrt.push(corners);
			let l = 1.0/(sideLength + 2);
			if ( i == 0 ) {
				/* BOGUS */
				/* should not use [0, 1] should use [inMin, inMax] */ 
				arrt.push([0, 2*l]);
				arrt.push([l, 3*l]);
			} else if ( corners.length == sideLength-1 ) {
				// console.log("i =  ", sideLength);
				arrt.push([(sideLength - 1) * l, 1 - l]);
				arrt.push([(sideLength ) * l, 1]);

			}else {
				arrt.push([(i-0)*l, (i+2)*l]);
				arrt.push([(i+1)*l, (i+3)*l]);
			}	

			count = count + 1;
			// BOGUS
			// doing the other side of the diagonal too which is a total waste!!!
			for (let i = 0; i < sideLength; i++) {
				for (let j = 0; j < sideLength; j++) {
					// console.log("count = ", count);
					// console.log("arr = ", arr[count]);
					arr[count][i][j] = arr[count-1][i][j];
				}
			}
			arr[count][sideLength-1 - corners.length][corners.length] = 1;
			count = count + 1;
		}
		return [arr, arrt];
	}

	/**
	 * get sum of combo
	 * @return {number}, the sum
	 */
	function discreteSum(arr, weights) {
		let sum = 0;
		let k = 0;
		// console.log('arr = ', arr);
		// console.log('weights = ', weights);
		// BOGUS
		// SUMMING ENTIRE MATRIX WHEN THERE IS ONLY EVER GOING TO BE vals ON 1 SIDE 
		// 
		for(let i = 0; i < arr.length; i++) {
			for (let j = 0; j < arr.length; j++) {
				// console.log('arr[i][j] = ', arr[i][j]);
				// console.log('weights[arr.length] = ', weights[arr.length]);
				// BOGUS
				// uniform weights here !!!
				sum += arr[i][j]*weights[0]; 
			}
		}
		// console.log('sum = ', sum);
		return sum;
	}

	/**
	 *
	 */
	function getAllIOPairs(arr, arrt, thresholds, weights) {
		let pairs = [];
		let input = [];
		let output = [];

		for ( let i = 0; i < arr.length; i++ ) {
			input = [];
			output = [];
			input[0] = arrt[i][0];
			input[1] = arrt[i][1];

			// weights is 1-D...combos are 2-D
			// console.log("weights = ", weights);
			// console.log("arr = ", arr);
			// console.log("arr shape = ", arr[i].length, "x", arr[i][0].length);
			output[0] = output[1] = discreteSum(arr[i], weights);
			pairs[i] = [input, output];
		}
		return pairs;
	}

	/**
	 *
	 */
	function createAllCombos (d) {
		// console.log("d = ", d);
		let l = d.thresholds.length - 3;
		// console.log("l = ", l);
		let n = Math.pow(2, l);

		// count is a global...cause the recurser nightmare
		count = 0;

		let corners = [];
		let array_of_combos = new Array(n);
		let array_of_thresholds = []; // = new Array(n);
		for (let i = 0; i < n; i++) {
			array_of_combos[i] = new Array(l);
			for (let j = 0; j < l; j++) {
				array_of_combos[i][j] = new Array(l);
				for (let k = 0; k < l; k++) {
					array_of_combos[i][j][k] = 0;
				}
			}
		}


		[array_of_combos, array_of_thresholds] = 
				recurser(l, corners, array_of_combos, array_of_thresholds, l);

		// let w = new preisach.initWeights(thresholds, 'uniform');
		// console.log("weights = ", w);

		let allStatios = getAllIOPairs(array_of_combos, array_of_thresholds, d.thresholds, d.weights);
		// let allCurves = combos2curves(array_of_combos, array_of_thresholds, d);
		// console.log('all pairs = ', allStatios);

		return allStatios;
		// return allCurves;
	}
	exports.createAllCombos = createAllCombos;
})( typeof exports === 'undefined' ? this['preisach_utils'] = {}: exports );
