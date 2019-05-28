/**
 * @author marcd 2019-04-03
 */


(function(exports) {
	/**
	 * @param
	 * @return
	 */
	function createCurves(board, combos) {
		/**
		 * curve for every combination 
		 */
		curves = [];
		for (var i = 0; i < combos.length; i++) {
			// BOGUS
			// these should be functiongraphs...not curves 
			// haha moreover they should be lines for the classical discrete Preisach
			curves[i] = board.create('curve', [combos[i][0],	combos[i][1]], {});
			// curves[i] = board.create('curve', [combos[i][0],	combos[i][1]], {strokecolor: 'blue'});
		}
		return curves;
	}

	/**
	 * @param
	 * @return
	 */
	function createHysterons(board, d) {
		jxgHysterons = [];
		for (var i = 0; i < d.thermostats.length; i++) {
			jxgHysterons[i] = 
				board.create(
				'point',
				[d.thermostats[i].high, d.thermostats[i].low],
				{ 
					// fixed true for discrete preisach, but not for arbitrary multi-stat!!!!!
					fixed: true,
					face: '[]',
					sizeUnit: 'user',
					size: (function (li) { 
									return function() { 						
										return 1/(2*li) -0.005;
									}
								}
							)(d.thresholds.length - 0),				
					color: 'green',
					fillOpacity: (function (li) { 
									return function() { 
										return d.thermostats[li].output; //exists for variable-thermo-stat oxymoron
									} 
								}
							)(i),
					name: ''
				}
			);
		}
		return jxgHysterons;
	}

	/**
	 * @param 
	 */
	 function removeCurves(brd, curves) {		
		if (typeof curves !== undefined && curves.length > 0) {
			for (let c of curves) {
				brd.removeObject(c);
			}
		}
	}

	exports.createCurves 	= createCurves;
	exports.createHysterons = createHysterons;
	exports.removeCurves 	= removeCurves;
	// exports.removeHysterons = removeHysterons;

})( typeof exports === 'undefined' ? this['jxgParams'] = {}: exports );
